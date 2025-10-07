"use client";

import React from "react";
import { DialogConfig } from "@/src/types/dialog.types";
import { useDialog } from "@/src/contexts/DialogContext";

interface DialogProps {
  dialog: DialogConfig;
}

const variantStyles = {
  default: {
    container: "bg-white dark:bg-black/90 border-gray-200 dark:border-gray-800",
    button: "bg-foreground text-background hover:opacity-90",
    cancelButton:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
  danger: {
    container:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    button: "bg-red-600 text-white hover:bg-red-700",
    cancelButton:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
  warning: {
    container:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    button: "bg-yellow-600 text-white hover:bg-yellow-700",
    cancelButton:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
  info: {
    container:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    button: "bg-blue-600 text-white hover:bg-blue-700",
    cancelButton:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
};

const icons = {
  default: (
    <svg
      className="w-6 h-6 text-gray-600 dark:text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  ),
  danger: (
    <svg
      className="w-6 h-6 text-red-600 dark:text-red-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-6 h-6 text-blue-600 dark:text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export default function Dialog({ dialog }: DialogProps) {
  const { hideDialog } = useDialog();
  const style = variantStyles[dialog.variant || "default"];

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    hideDialog(dialog.id);
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    hideDialog(dialog.id);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !dialog.persistent) {
      handleCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          ${style.container}
          border rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out
          animate-in zoom-in-95 fade-in-0
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-6 pb-4">
          {icons[dialog.variant || "default"]}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
              {dialog.title}
            </h3>
            {dialog.message && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {dialog.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={handleCancel}
            className={`
              ${style.cancelButton}
              px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
            `}
          >
            {dialog.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className={`
              ${style.button}
              px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {dialog.confirmText || "Confirm"}
          </button>
        </div>

        <style jsx>{`
          @keyframes zoom-in-95 {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes fade-in-0 {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-in {
            animation-fill-mode: both;
          }
        `}</style>
      </div>
    </div>
  );
}
