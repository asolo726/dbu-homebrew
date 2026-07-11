"use client";
import { EditModeProvider } from "./EditModeContext";
import EditToolbar from "./EditToolbar";

export default function EditModeWrapper({ children, canEdit, canContribute, keyName, toggleStatus, contributorEmail, contributorName, isAdmin }) {
  if (!canEdit && !canContribute) return <>{children}</>;

  return (
    <EditModeProvider
      keyName={keyName}
      toggleStatus={toggleStatus}
      contributorEmail={canContribute ? contributorEmail : null}
      contributorName={canContribute ? contributorName : null}
      isAdmin={isAdmin ?? false}
    >
      {children}
      <EditToolbar canEdit={canEdit} canContribute={canContribute} />
    </EditModeProvider>
  );
}
