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
  const textareaRef = useRef(null);

  if (!ctx) return <>{parseInlineLinks(value)}</>;

  const { isEditing, setChange, pendingChanges } = ctx;
  const current = path in pendingChanges ? pendingChanges[path] : value;

  useEffect(() => {
    const el = textareaRef.current;
    // Skip hidden elements (e.g. inside a closed AddendumBox) — scrollHeight is 0 when display:none
    if (isEditing && el && el.offsetParent !== null) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }

    if (!isEditing || !el) return;
    if (el.offsetParent !== null) return; // already handled above

    // Watch for when it enters the viewport (e.g. AddendumBox opens)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isEditing, current]);

  if (!isEditing) return <>{parseInlineLinks(current)}</>;

  return (
    <textarea
      ref={textareaRef}
      className={`bg-transparent border-b border-dbu-header resize-none w-full outline-none leading-snug ${className}`}
      value={current ?? ""}
      rows={1}
      onChange={(e) => {
        setChange(path, e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
    />
  );
}
