"use client";
import { EditModeProvider } from "./EditModeContext";
import EditToolbar from "./EditToolbar";

/**
 * Wraps page content with the edit mode context and floating toolbar.
 * canEdit should be passed from the server (based on auth session).
 */
export default function EditModeWrapper({ children, canEdit, keyName }) {
  if (!canEdit) return <>{children}</>;

  return (
    <EditModeProvider keyName={keyName}>
      {children}
      <EditToolbar />
    </EditModeProvider>
  );
}
