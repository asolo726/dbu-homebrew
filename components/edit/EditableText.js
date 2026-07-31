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

// Parses __text__ into bold text for display mode.
function parseBoldText(text) {
  if (!text) return text;

  if (Array.isArray(text)) {
    return text.map((part, index) => parseBoldText(part));
  }

  if (typeof text !== "string") return text;

  const parts = [];
  const regex = /__(.+?)__/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <span key={`${match.index}-${match[0]}`} className="font-bold text-dbu-header">
        {match[1]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function parseAndFormat(value) {
  let valueToBeParsed = value;
  valueToBeParsed = parseInlineLinks(valueToBeParsed);
  valueToBeParsed = parseBoldText(valueToBeParsed);
  return valueToBeParsed;
}

export default function EditableText({ path, value, className = "" }) {
  const ctx = useEditMode();
  const spanRef = useRef(null);

  if (!ctx) return <>{parseAndFormat(value)}</>;

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

  if (!isEditing || !path) return <>{parseAndFormat(current)}</>;

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
