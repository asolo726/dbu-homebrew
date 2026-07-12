"use client";
import { useEditMode } from "./EditModeContext";
import { useEffect, useRef } from "react";

// Parses [text](url) markdown links into <a> elements for display mode
function parseInlineLinks(text) {
  if (!text || typeof text !== "string" || !text.includes("[")) return text;
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-dbu-link hover:underline">
          {match[1]}
        </a>
      );
    }
    return part;
  });
}

export default function EditableText({ path, value, className = "" }) {
  const ctx = useEditMode();
  const spanRef = useRef(null);

  if (!ctx) return <>{parseInlineLinks(value)}</>;

  const { isEditing, setChange, pendingChanges } = ctx;
  const current = (path && path in pendingChanges) ? pendingChanges[path] : (value ?? "");

  // Sync DOM when `current` changes from outside (e.g. undo/redo).
  // Skip while this element has focus — we must not clobber the cursor.
  useEffect(() => {
    const el = spanRef.current;
    if (!el || !isEditing) return;
    if (document.activeElement === el) return;
    if (el.innerText !== current) {
      el.textContent = current ?? "";
    }
  }, [isEditing, current]);

  if (!isEditing || !path) return <>{parseInlineLinks(current)}</>;

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
      className={`border-b border-dbu-header outline-none whitespace-pre-wrap ${className}`}
      onInput={(e) => setChange(path, e.currentTarget.innerText)}
    />
  );
}
