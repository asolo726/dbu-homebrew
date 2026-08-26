"use client";
import { useEditMode } from "./EditModeContext";
import { useEffect, useRef } from "react";
import { parseAndFormat } from "./util/parserFunctions";

export default function EditableText({ path, value, className = "" }) {
  const ctx = useEditMode();
  const spanRef = useRef(null);

  if (!ctx) return <>{parseAndFormat(value)}</>;

  const { isEditing, isContributing, setChange, pendingChanges } = ctx;
  const canEdit = isEditing || isContributing;
  const current =
    path && path in pendingChanges ? pendingChanges[path] : (value ?? "");

  // Sync DOM when `current` changes from outside (e.g. undo/redo).
  // Skip while this element has focus — we must not clobber the cursor.
  useEffect(() => {
    const el = spanRef.current;
    if (!el || !canEdit) return;
    if (document.activeElement === el) return;
    if (el.innerText !== current) {
      el.textContent = current ?? "";
    }
  }, [canEdit, current]);

  if (!canEdit || !path) return <>{parseAndFormat(current)}</>;

  // Ref callback: populates initial content synchronously on mount
  // to avoid a flash of empty text before the effect runs.
  function attachRef(node) {
    spanRef.current = node;
    if (node && node.textContent === "") {
      node.textContent = current ?? "";
    }
  }

  return (
    <span
      ref={attachRef}
      contentEditable
      suppressContentEditableWarning
      className={`pr-1 border-b border-dbu-header outline-none whitespace-pre-wrap ${className}`}
      onInput={(e) => setChange(path, e.currentTarget.innerText)}
    />
  );
}
