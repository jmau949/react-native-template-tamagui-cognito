// Toast functionality handled via Tamagui toast system
import { useCallback, useEffect, useRef } from "react";
import {
  AsyncErrorOptions,
  ErrorCategory,
  ErrorSeverity,
  RetryConfig,
} from "../types/errors";
import {
  asyncErrorHandler,
  setGlobalToastFunctions,
} from "../utils/asyncErrorHandler";
import { errorLogger } from "../utils/errorLogger";
import { useToast } from "./useToast";

interface UseErrorHandlerOptions {
  defaultCategory?: ErrorCategory;
  defaultSeverity?: ErrorSeverity;
  showToastByDefault?: boolean;
  context?: Record<string, any>;
}

interface ErrorHandlerReturn {
  handleError: (error: Error, options?: AsyncErrorOptions) => string;
  handleAsyncError: <T>(
    operation: () => Promise<T>,
    options?: AsyncErrorOptions
  ) => Promise<T>;
  handleAsyncErrorWithRetry: <T>(
    operation: () => Promise<T>,
    retryConfig?: Partial<RetryConfig>,
    options?: AsyncErrorOptions
  ) => Promise<T>;
  showErrorToast: (message: string, duration?: number) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  clearErrorState: () => void;
}

export const useErrorHandler = (
  options: UseErrorHandlerOptions = {}
): ErrorHandlerReturn => {
  const {
    defaultCategory = ErrorCategory.UI_ERROR,
    defaultSeverity = ErrorSeverity.MEDIUM,
    showToastByDefault = true,
    context = {},
  } = options;

  const errorCountRef = useRef(0);
  const lastErrorTimeRef = useRef(0);
  const toast = useToast();

  // Set global toast functions on mount
  useEffect(() => {
    setGlobalToastFunctions(toast.showErrorToast, toast.showSuccessToast);
  }, [toast.showErrorToast, toast.showSuccessToast]);

  const handleError = useCallback(
    (error: Error, errorOptions: AsyncErrorOptions = {}): string => {
      const now = Date.now();
      const timeSinceLastError = now - lastErrorTimeRef.current;

      // Throttle rapid consecutive errors
      if (timeSinceLastError < 1000) {
        errorCountRef.current++;
        if (errorCountRef.current > 3) {
          // Too many errors in quick succession, don't show toast
          return errorLogger.logError(error, defaultCategory, defaultSeverity, {
            ...context,
            metadata: {
              ...context.metadata,
              throttled: true,
              errorCount: errorCountRef.current,
            },
          });
        }
      } else {
        errorCountRef.current = 1;
      }

      lastErrorTimeRef.current = now;

      const {
        category = defaultCategory,
        severity = defaultSeverity,
        showToast = showToastByDefault,
        customMessage,
        context: errorContext = {},
      } = errorOptions;

      // Log the error
      const errorId = errorLogger.logError(error, category, severity, {
        ...context,
        ...errorContext,
      });

      // Show toast if requested
      if (showToast) {
        const message = customMessage || getErrorMessage(error);
        toast.showErrorToast(message);
      }

      return errorId;
    },
    [defaultCategory, defaultSeverity, showToastByDefault, context, toast]
  );

  const handleAsyncError = useCallback(
    async <T>(
      operation: () => Promise<T>,
      errorOptions: AsyncErrorOptions = {}
    ): Promise<T> => {
      try {
        return await operation();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        handleError(err, errorOptions);
        throw err;
      }
    },
    [handleError]
  );

  const handleAsyncErrorWithRetry = useCallback(
    async <T>(
      operation: () => Promise<T>,
      retryConfig: Partial<RetryConfig> = {},
      errorOptions: AsyncErrorOptions = {}
    ): Promise<T> => {
      return asyncErrorHandler.handleAsyncWithRetry(operation, retryConfig, {
        context,
        ...errorOptions,
      });
    },
    [context]
  );

  const showErrorToast = useCallback(
    (message: string, duration = 4000) => {
      toast.showErrorToast(message, duration);
    },
    [toast]
  );

  const showSuccessToast = useCallback(
    (message: string, duration = 3000) => {
      toast.showSuccessToast(message, duration);
    },
    [toast]
  );

  const clearErrorState = useCallback(() => {
    errorCountRef.current = 0;
    lastErrorTimeRef.current = 0;
  }, []);

  return {
    handleError,
    handleAsyncError,
    handleAsyncErrorWithRetry,
    showErrorToast,
    showSuccessToast,
    clearErrorState,
  };
};

// Specialized hooks for specific error types

export const useApiErrorHandler = (baseUrl?: string) => {
  const errorHandler = useErrorHandler({
    defaultCategory: ErrorCategory.API_ERROR,
    context: { baseUrl },
  });

  const handleApiError = useCallback(
    async <T>(
      request: () => Promise<Response>,
      options: {
        endpoint?: string;
        method?: string;
        parseResponse?: boolean;
      } & AsyncErrorOptions = {}
    ): Promise<T> => {
      return asyncErrorHandler.handleApiRequest<T>(request, {
        ...options,
        context: {
          ...options.context,
          metadata: {
            ...options.context?.metadata,
            baseUrl,
          },
        },
      });
    },
    [baseUrl]
  );

  return {
    ...errorHandler,
    handleApiError,
  };
};

export const useNavigationErrorHandler = () => {
  return useErrorHandler({
    defaultCategory: ErrorCategory.NAVIGATION_ERROR,
    defaultSeverity: ErrorSeverity.MEDIUM,
  });
};

export const usePerformanceErrorHandler = () => {
  return useErrorHandler({
    defaultCategory: ErrorCategory.PERFORMANCE_ERROR,
    defaultSeverity: ErrorSeverity.LOW,
    showToastByDefault: false, // Performance errors usually don't need user notification
  });
};

// Utility function to get user-friendly error messages
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your connection.";
  }

  if (message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  if (message.includes("parse") || message.includes("json")) {
    return "Invalid response format. Please try again.";
  }

  if (message.includes("permission") || message.includes("unauthorized")) {
    return "Permission denied. Please check your access rights.";
  }

  // For development, show the actual error message
  if (__DEV__) {
    return error.message;
  }

  // Generic fallback for production
  return "Something went wrong. Please try again.";
}
