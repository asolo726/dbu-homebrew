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

  // Stores a full array at arrayPath and removes any child-path keys that would
  // conflict with it in a MongoDB $set (e.g. "traits.0.abilities.0.desc" when
  // "traits.0.abilities" is being set).
  function setArrayChange(arrayPath, value) {
    const prefix = arrayPath + ".";
    setPendingChanges((prev) => {
      const next = {};
      for (const key of Object.keys(prev)) {
        if (!key.startsWith(prefix)) next[key] = prev[key];
      }
      next[arrayPath] = value;
      return next;
    });
  }

  function clearChanges() {
    setPendingChanges({});
  }

  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <EditModeContext.Provider
      value={{ isEditing, setIsEditing, pendingChanges, setChange, setArrayChange, clearChanges, hasChanges, keyName }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
