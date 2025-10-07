"use client";

import React from "react";
import { useDialog } from "@/src/contexts/DialogContext";
import Dialog from "./Dialog";

export default function DialogContainer() {
  const { dialogs } = useDialog();

  if (dialogs.length === 0) return null;

  return (
    <>
      {dialogs.map((dialog) => (
        <Dialog key={dialog.id} dialog={dialog} />
      ))}
    </>
  );
}
