"use client";
import { useEffect } from "react";

export default function ViewTracker({ keyName, title, isAuthor }) {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentPages") || "[]");
      const filtered = stored.filter((p) => p.keyName !== keyName);
      const updated = [{ keyName, title }, ...filtered].slice(0, 5);
      localStorage.setItem("recentPages", JSON.stringify(updated));
    } catch {}

    if (isAuthor) return;
    fetch("/api/pages/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyName }),
    }).catch(() => {});
  }, [keyName, title, isAuthor]);

  return null;
}
