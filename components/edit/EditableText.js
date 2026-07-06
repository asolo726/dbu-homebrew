"use client";
import { useEditMode } from "./EditModeContext";
import { useEffect, useRef } from "react";

export default function EditableText({ path, value, className = "" }) {
  const ctx = useEditMode();
  const textareaRef = useRef(null);

  if (!ctx) return <>{value}</>;

  const { isEditing, setChange, pendingChanges } = ctx;
  const current = path in pendingChanges ? pendingChanges[path] : value;

  useEffect(() => {
    const el = textareaRef.current;
    if (!isEditing || !el) return;

    function autoSize() {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }

    // If already visible, size immediately
    if (el.offsetParent !== null) {
      autoSize();
      return;
    }

    // Otherwise watch for when it enters the viewport (e.g. AddendumBox opens)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          autoSize();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
    />
  );
}
