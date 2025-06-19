import { useToastController } from "@tamagui/toast";
import { useCallback } from "react";

export interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
  type?: "error" | "success" | "info" | "warning";
}

export const useToast = () => {
  const toast = useToastController();

  const showToast = useCallback(
    ({ title, message, duration = 4000, type = "info" }: ToastOptions) => {
      toast.show(title || getDefaultTitle(type), {
        message,
        duration,
        viewportName: "main",
      });
    },
    [toast]
  );

  const showErrorToast = useCallback(
    (message: string, duration = 4000) => {
      showToast({
        title: "Error",
        message,
        duration,
        type: "error",
      });
    },
    [showToast]
  );

  const showSuccessToast = useCallback(
    (message: string, duration = 3000) => {
      showToast({
        title: "Success",
        message,
        duration,
        type: "success",
      });
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (message: string, duration = 4000) => {
      showToast({
        title: "Warning",
        message,
        duration,
        type: "warning",
      });
    },
    [showToast]
  );

  const showInfoToast = useCallback(
    (message: string, duration = 3000) => {
      showToast({
        title: "Info",
        message,
        duration,
        type: "info",
      });
    },
    [showToast]
  );

  return {
    showToast,
    showErrorToast,
    showSuccessToast,
    showWarningToast,
    showInfoToast,
  };
};

function getDefaultTitle(type: string): string {
  switch (type) {
    case "error":
      return "❌ Error";
    case "success":
      return "✅ Success";
    case "warning":
      return "⚠️ Warning";
    case "info":
    default:
      return "ℹ️ Info";
  }
}
