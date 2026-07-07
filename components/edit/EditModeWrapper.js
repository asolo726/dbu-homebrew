"use client";
import { EditModeProvider } from "./EditModeContext";
import EditToolbar from "./EditToolbar";

export default function EditModeWrapper({ children, canEdit, keyName }) {
  if (!canEdit) return <>{children}</>;

  return (
    <EditModeProvider keyName={keyName}>
      {children}
      <EditToolbar />
    </EditModeProvider>
  );
}
