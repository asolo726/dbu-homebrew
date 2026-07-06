"use client";
import { useEffect } from "react";

export default function ViewTracker({ keyName }) {

  useEffect(() => {
    fetch("/api/pages/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyName }),
    }).catch(() => {});
  }, [keyName]);

  return null;
}
