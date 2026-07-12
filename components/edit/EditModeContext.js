"use client";
import { createContext, useContext, useState, useRef } from "react";

const EditModeContext = createContext(null);

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children, keyName, toggleStatus, contributorEmail = null, contributorName = null, isAdmin = false, isCommunity = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [pendingChanges, _setPendingChanges] = useState({});
  // [length, index] as state so canUndo/canRedo are reactive
  const [historyMeta, setHistoryMeta] = useState({ len: 1, idx: 0 });

  // Refs so callbacks always see fresh values without stale closures
  const pendingRef = useRef({});
  const historyRef = useRef([{}]); // history[0] = baseline (empty)
  const historyIdxRef = useRef(0);
  const lastSnapshotTimeRef = useRef(0);

  function _apply(changes) {
    pendingRef.current = changes;
    _setPendingChanges(changes);
  }

  function _pushSnapshot(snapshot) {
    // Discard any redo history beyond current index
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push({ ...snapshot });
    // Cap at 50 entries
    if (historyRef.current.length > 51) historyRef.current.shift();
    else historyIdxRef.current++;
    setHistoryMeta({ len: historyRef.current.length, idx: historyIdxRef.current });
  }

  function setChange(path, value) {
    // Debounce snapshots for text edits (one checkpoint per 600ms of inactivity)
    const now = Date.now();
    if (now - lastSnapshotTimeRef.current > 600) {
      _pushSnapshot(pendingRef.current);
      lastSnapshotTimeRef.current = now;
    }
    _apply({ ...pendingRef.current, [path]: value });
  }

  // Stores a full array and removes child-path keys that would conflict in MongoDB $set
  function setArrayChange(arrayPath, value) {
    // Structural changes always get an immediate snapshot
    _pushSnapshot(pendingRef.current);
    lastSnapshotTimeRef.current = Date.now();

    const prefix = arrayPath + ".";
    const next = {};
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
    setHistoryMeta({ len: historyRef.current.length, idx: historyIdxRef.current });
  }

  function redo() {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const restored = historyRef.current[historyIdxRef.current];
    _apply(restored);
    setHistoryMeta({ len: historyRef.current.length, idx: historyIdxRef.current });
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

  return (
    <EditModeContext.Provider
      value={{
        isEditing, setIsEditing,
        isContributing, setIsContributing,
        contributorEmail, contributorName,
        isAdmin, isCommunity,
        pendingChanges, setChange, setArrayChange, clearChanges, hasChanges,
        undo, redo, canUndo, canRedo,
        keyName, toggleStatus,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
