import { ToastType } from "@/src/types/toast.types";

interface ToastOptions {
  duration?: number;
  persistent?: boolean;
}

export function createToastMessage(
  type: ToastType,
  title: string,
  message?: string,
  options?: ToastOptions
) {
  return {
    type,
    title,
    message,
    duration: options?.duration,
    persistent: options?.persistent,
  };
}

// Predefined toast creators for common use cases
export const toast = {
  success: (title: string, message?: string, options?: ToastOptions) =>
    createToastMessage("success", title, message, options),

  error: (title: string, message?: string, options?: ToastOptions) =>
    createToastMessage("error", title, message, options),

  warning: (title: string, message?: string, options?: ToastOptions) =>
    createToastMessage("warning", title, message, options),

  info: (title: string, message?: string, options?: ToastOptions) =>
    createToastMessage("info", title, message, options),
};
