import {
  AsyncErrorOptions,
  ErrorCategory,
  ErrorSeverity,
  RetryConfig,
} from "../types/errors";
import { errorLogger } from "./errorLogger";

// Type declaration for React Native global
declare const global: any;

// Toast function type
type ToastFunction = (message: string, duration?: number) => void;

// Global toast function that can be set by components
let globalShowErrorToast: ToastFunction | null = null;
let globalShowSuccessToast: ToastFunction | null = null;

// Function to set the global toast functions
export const setGlobalToastFunctions = (
  showErrorToast: ToastFunction,
  showSuccessToast: ToastFunction
) => {
  globalShowErrorToast = showErrorToast;
  globalShowSuccessToast = showSuccessToast;
};

class AsyncErrorHandler {
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  private unhandledRejectionHandler: ((event: any) => void) | null = null;

  constructor() {
    this.setupGlobalHandlers();
  }

  /**
   * Handle async operations with automatic error handling
   */
  public async handleAsync<T>(
    operation: () => Promise<T>,
    options: AsyncErrorOptions = {}
  ): Promise<T> {
    const {
      category = ErrorCategory.API_ERROR,
      severity = ErrorSeverity.MEDIUM,
      retryable = true,
      showToast = true,
      customMessage,
      context = {},
    } = options;

    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // Log the error
      const errorId = errorLogger.logError(err, category, severity, {
        userAction: "async_operation",
        ...context,
      });

      // Show user notification if requested
      if (showToast) {
        this.showErrorToast(err, customMessage);
      }

      // Re-throw to allow caller to handle if needed
      throw err;
    }
  }

  /**
   * Handle async operations with retry logic
   */
  public async handleAsyncWithRetry<T>(
    operation: () => Promise<T>,
    retryConfig: Partial<RetryConfig> = {},
    options: AsyncErrorOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultRetryConfig, ...retryConfig };
    const {
      category = ErrorCategory.API_ERROR,
      severity = ErrorSeverity.MEDIUM,
      showToast = true,
      customMessage,
      context = {},
    } = options;

    let lastError: Error;
    let attempt = 0;

    while (attempt <= config.maxRetries) {
      try {
        const result = await operation();

        // If we succeeded after retries, log the recovery
        if (attempt > 0) {
          errorLogger.logError(
            new Error(`Operation succeeded after ${attempt} retries`),
            ErrorCategory.API_ERROR,
            ErrorSeverity.LOW,
            {
              userAction: "retry_success",
              metadata: { attempts: attempt },
              ...context,
            }
          );
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;

        // Log retry attempts
        errorLogger.logError(
          lastError,
          category,
          attempt <= config.maxRetries ? ErrorSeverity.LOW : severity,
          {
            userAction: "async_operation_retry",
            metadata: {
              attempt,
              maxRetries: config.maxRetries,
              isLastAttempt: attempt > config.maxRetries,
            },
            ...context,
          }
        );

        if (attempt > config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelay
        );

        await this.delay(delay);
      }
    }

    // All retries failed
    if (showToast) {
      this.showErrorToast(
        lastError!,
        customMessage || `Operation failed after ${config.maxRetries} attempts`
      );
    }

    throw lastError!;
  }

  /**
   * Handle API requests with standardized error handling
   */
  public async handleApiRequest<T>(
    request: () => Promise<Response>,
    options: AsyncErrorOptions & {
      endpoint?: string;
      method?: string;
      parseResponse?: boolean;
    } = {}
  ): Promise<T> {
    const {
      endpoint = "unknown",
      method = "GET",
      parseResponse = true,
      context = {},
      ...asyncOptions
    } = options;

    try {
      const response = await this.handleAsync(request, {
        category: ErrorCategory.API_ERROR,
        context: {
          ...context,
          metadata: {
            endpoint,
            method,
            ...context.metadata,
          },
        },
        ...asyncOptions,
      });

      if (!response.ok) {
        const errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        const apiError = new Error(errorMessage);

        // Log API error with response details
        errorLogger.logApiError(
          apiError,
          endpoint,
          method,
          response.status,
          context
        );

        throw apiError;
      }

      if (parseResponse) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("API request failed")
      ) {
        throw error; // Already handled above
      }

      // Handle network errors
      const networkError =
        error instanceof Error ? error : new Error(String(error));
      errorLogger.logApiError(
        networkError,
        endpoint,
        method,
        undefined,
        context
      );

      throw networkError;
    }
  }

  /**
   * Wrap a promise to handle errors gracefully
   */
  public wrapPromise<T>(
    promise: Promise<T>,
    options: AsyncErrorOptions = {}
  ): Promise<T> {
    return promise.catch((error) => {
      const err = error instanceof Error ? error : new Error(String(error));

      errorLogger.logError(
        err,
        options.category || ErrorCategory.API_ERROR,
        options.severity || ErrorSeverity.MEDIUM,
        {
          userAction: "wrapped_promise",
          ...options.context,
        }
      );

      if (options.showToast !== false) {
        this.showErrorToast(err, options.customMessage);
      }

      throw err;
    });
  }

  /**
   * Setup global unhandled promise rejection handler
   */
  private setupGlobalHandlers(): void {
    // React Native global error handling
    if (typeof global !== "undefined" && global.ErrorUtils) {
      const originalHandler = global.ErrorUtils.getGlobalHandler();

      global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        errorLogger.logError(
          error,
          ErrorCategory.UI_ERROR,
          isFatal ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
          {
            userAction: "global_error",
            metadata: { isFatal },
          }
        );

        // Call original handler
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }

    // Set up unhandled promise rejection handler for development
    if (__DEV__ && typeof global !== "undefined") {
      this.unhandledRejectionHandler = (event: any) => {
        const error =
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason));

        errorLogger.logError(
          error,
          ErrorCategory.API_ERROR,
          ErrorSeverity.HIGH,
          {
            userAction: "unhandled_promise_rejection",
            metadata: {
              type: "unhandled_rejection",
              promise: event.promise?.toString?.() || "unknown",
            },
          }
        );

        // Prevent the default browser behavior
        event.preventDefault?.();
      };

      // Add listener if available
      if (global.addEventListener) {
        global.addEventListener(
          "unhandledrejection",
          this.unhandledRejectionHandler
        );
      }
    }
  }

  /**
   * Show error toast using Tamagui toast or fallback to console
   */
  private showErrorToast(error: Error, customMessage?: string): void {
    const message = customMessage || this.getUserFriendlyMessage(error);

    // Try to use global toast function first
    if (globalShowErrorToast) {
      globalShowErrorToast(message);
    } else if (__DEV__) {
      // Fallback to console in development
      console.log(
        "%c❌ Error Toast",
        "color: #ff4444; font-weight: bold; font-size: 14px;",
        "\n",
        message
      );
    }

    // In production without toast setup, errors are just logged silently
  }

  /**
   * Convert technical error messages to user-friendly ones
   */
  private getUserFriendlyMessage(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }

    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    if (message.includes("500")) {
      return "Server error. Please try again later.";
    }

    if (message.includes("404")) {
      return "The requested resource was not found.";
    }

    if (message.includes("401") || message.includes("403")) {
      return "Authentication error. Please log in again.";
    }

    // Default fallback
    return "Something went wrong. Please try again.";
  }

  /**
   * Simple delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Cleanup global handlers
   */
  public cleanup(): void {
    if (this.unhandledRejectionHandler && global.removeEventListener) {
      global.removeEventListener(
        "unhandledrejection",
        this.unhandledRejectionHandler
      );
    }
  }
}

// Singleton instance
export const asyncErrorHandler = new AsyncErrorHandler();

// Convenience functions
export const handleAsync = <T>(
  operation: () => Promise<T>,
  options?: AsyncErrorOptions
) => asyncErrorHandler.handleAsync(operation, options);

export const handleAsyncWithRetry = <T>(
  operation: () => Promise<T>,
  retryConfig?: Partial<RetryConfig>,
  options?: AsyncErrorOptions
) => asyncErrorHandler.handleAsyncWithRetry(operation, retryConfig, options);

export const handleApiRequest = <T>(
  request: () => Promise<Response>,
  options?: AsyncErrorOptions & {
    endpoint?: string;
    method?: string;
    parseResponse?: boolean;
  }
) => asyncErrorHandler.handleApiRequest<T>(request, options);

export const wrapPromise = <T>(
  promise: Promise<T>,
  options?: AsyncErrorOptions
) => asyncErrorHandler.wrapPromise(promise, options);
