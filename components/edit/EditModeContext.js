"use client";
import { createContext, useContext, useState } from "react";

const EditModeContext = createContext(null);

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children, keyName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  function setChange(path, value) {
    setPendingChanges((prev) => ({ ...prev, [path]: value }));
  }

  function clearChanges() {
    setPendingChanges({});
  }

  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <EditModeContext.Provider
      value={{ isEditing, setIsEditing, pendingChanges, setChange, clearChanges, hasChanges, keyName }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
