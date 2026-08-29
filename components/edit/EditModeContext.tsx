"use client";
import { createContext, useContext, useState, useRef, ReactNode } from "react";

export interface EditModeContextType {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isContributing: boolean;
  setIsContributing: (value: boolean) => void;
  contributorEmail: string | null;
  contributorName: string | null;
  isAdmin: boolean;
  isCommunity: boolean;
  pendingChanges: Record<string, any>;
  setChange: (path: string, value: any) => void;
  setArrayChange: (arrayPath: string, value: any[]) => void;
  clearChanges: () => void;
  hasChanges: boolean;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  keyName: string;
  toggleStatus: boolean | null;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export function useEditMode(): EditModeContextType | null {
  return useContext(EditModeContext);
}

interface EditModeProviderProps {
  children: ReactNode;
  keyName: string;
  toggleStatus: boolean | null;
  contributorEmail?: string | null;
  contributorName?: string | null;
  isAdmin?: boolean;
  isCommunity?: boolean;
}

export function EditModeProvider({
  children,
  keyName,
  toggleStatus,
  contributorEmail = null,
  contributorName = null,
  isAdmin = false,
  isCommunity = false,
}: EditModeProviderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [pendingChanges, _setPendingChanges] = useState<Record<string, any>>({});
  const [historyMeta, setHistoryMeta] = useState({ len: 1, idx: 0 });

  const pendingRef = useRef<Record<string, any>>({});
  const historyRef = useRef<Record<string, any>[]>([{}]);
  const historyIdxRef = useRef(0);
  const lastSnapshotTimeRef = useRef(0);

  function _apply(changes: Record<string, any>) {
    pendingRef.current = changes;
    _setPendingChanges(changes);
  }

  function _pushSnapshot(snapshot: Record<string, any>) {
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push({ ...snapshot });
    if (historyRef.current.length > 51) historyRef.current.shift();
    else historyIdxRef.current++;
    setHistoryMeta({
      len: historyRef.current.length,
      idx: historyIdxRef.current,
    });
  }

  function setChange(path: string, value: any) {
    const now = Date.now();
    if (now - lastSnapshotTimeRef.current > 600) {
      _pushSnapshot(pendingRef.current);
      lastSnapshotTimeRef.current = now;
    }
    _apply({ ...pendingRef.current, [path]: value });
  }

  function setArrayChange(arrayPath: string, value: any[]) {
    _pushSnapshot(pendingRef.current);
    lastSnapshotTimeRef.current = Date.now();

    const prefix = arrayPath + ".";
    const next: Record<string, any> = {};
    for (const key of Object.keys(pendingRef.current)) {
      if (!key.startsWith(prefix)) next[key] = pendingRef.current[key];
    }
    next[arrayPath] = value;
    _apply(next);
  }

  function undo() {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current--;
    const restored = historyRef.current[historyIdxRef.current];
    _apply(restored);
    setHistoryMeta({
      len: historyRef.current.length,
      idx: historyIdxRef.current,
    });
  }

  function redo() {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const restored = historyRef.current[historyIdxRef.current];
    _apply(restored);
    setHistoryMeta({
      len: historyRef.current.length,
      idx: historyIdxRef.current,
    });
  }

  function clearChanges() {
    historyRef.current = [{}];
    historyIdxRef.current = 0;
    lastSnapshotTimeRef.current = 0;
    setHistoryMeta({ len: 1, idx: 0 });
    _apply({});
  }

  const hasChanges = Object.keys(pendingChanges).length > 0;
  const canUndo = historyMeta.idx > 0;
  const canRedo = historyMeta.idx < historyMeta.len - 1;

  const value: EditModeContextType = {
    isEditing,
    setIsEditing,
    isContributing,
    setIsContributing,
    contributorEmail,
    contributorName,
    isAdmin,
    isCommunity,
    pendingChanges,
    setChange,
    setArrayChange,
    clearChanges,
    hasChanges,
    undo,
    redo,
    canUndo,
    canRedo,
    keyName,
    toggleStatus,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}