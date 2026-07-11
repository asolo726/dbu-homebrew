"use client";
import { EditModeProvider } from "./EditModeContext";
import EditToolbar from "./EditToolbar";

export default function EditModeWrapper({ children, canEdit, keyName, toggleStatus }) {
  if (!canEdit) return <>{children}</>;

  return (
    <EditModeProvider keyName={keyName} toggleStatus={toggleStatus}>
      {children}
      <EditToolbar />
    </EditModeProvider>
  );
}
