"use client";
import { useEditMode } from "./EditModeContext";
import { useEffect, useRef } from "react";

/**
 * Renders plain text normally, and a resizing textarea when in edit mode.
 * @param {string} path  - dot-notation path into the document (e.g. "traits.0.desc")
 * @param {string} value - the current text value from the DB
 * @param {string} className - optional extra classes for the textarea
 */
export default function EditableText({ path, value, className = "" }) {
  const ctx = useEditMode();
  const textareaRef = useRef(null);

  // If context isn't available (e.g. rendered outside EditModeWrapper), just render text
  if (!ctx) return <>{value}</>;

  const { isEditing, setChange, pendingChanges } = ctx;
  const current = path in pendingChanges ? pendingChanges[path] : value;

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, current]);

  if (!isEditing) return <>{current}</>;

  return (
    <textarea
      ref={textareaRef}
      className={`bg-transparent border-b border-dbu-header resize-none w-full outline-none leading-snug ${className}`}
      value={current}
      rows={1}
      onChange={(e) => {
        setChange(path, e.target.value);
        // Auto-resize
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
    />
  );
}
