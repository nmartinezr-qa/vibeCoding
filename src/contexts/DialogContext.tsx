"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { DialogContextType, DialogConfig } from "@/src/types/dialog.types";

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

interface DialogProviderProps {
  children: React.ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<DialogConfig[]>([]);

  const showDialog = useCallback((config: Omit<DialogConfig, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newDialog: DialogConfig = {
      id,
      variant: "default", // Default variant
      confirmText: "Confirm",
      cancelText: "Cancel",
      ...config,
      type: config.type || "confirm", // Use provided type or default
    };

    setDialogs((prev) => [...prev, newDialog]);
    return id;
  }, []);

  const hideDialog = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  }, []);

  const clearDialogs = useCallback(() => {
    setDialogs([]);
  }, []);

  const value: DialogContextType = {
    dialogs,
    showDialog,
    hideDialog,
    clearDialogs,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
