export interface DialogConfig {
  id: string;
  type: "confirm" | "alert" | "custom";
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger" | "warning" | "info";
  onConfirm?: () => void;
  onCancel?: () => void;
  persistent?: boolean;
}

export interface DialogContextType {
  dialogs: DialogConfig[];
  showDialog: (config: Omit<DialogConfig, "id">) => string;
  hideDialog: (id: string) => void;
  clearDialogs: () => void;
}
