"use client";
import { EditModeProvider } from "./EditModeContext";
import EditToolbar from "./EditToolbar";

export default function EditModeWrapper({ children, canEdit, canContribute, keyName, toggleStatus, contributorEmail, contributorName, isAdmin, isCommunity }) {
  if (!canEdit && !canContribute) return <>{children}</>;

  return (
    <EditModeProvider
      keyName={keyName}
      toggleStatus={toggleStatus}
      contributorEmail={contributorEmail ?? null}
      contributorName={contributorName ?? null}
      isAdmin={isAdmin ?? false}
      isCommunity={isCommunity ?? false}
    >
      {children}
      <EditToolbar canEdit={canEdit} canContribute={canContribute} />
    </EditModeProvider>
  );
}
