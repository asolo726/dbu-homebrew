"use client";
import { useState, useEffect } from "react";

const LS_KEY = "dbu_page_votes";

function readVotes() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}
function persistVote(key, dir) {
  try {
    const v = readVotes(); v[key] = dir;
    localStorage.setItem(LS_KEY, JSON.stringify(v));
  } catch {}
}
function clearVote(key) {
  try {
    const v = readVotes(); delete v[key];
    localStorage.setItem(LS_KEY, JSON.stringify(v));
  } catch {}
}

export default function PageVoteButtons({
  keyName,
  initialUpvotes = 0,
  initialDownvotes = 0,
  small = false,
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [myVote, setMyVote] = useState(null);

  // Restore vote state from localStorage
  useEffect(() => {
    const stored = readVotes()[`page:${keyName}`];
    if (stored) setMyVote(stored);
  }, [keyName]);

  // On page view, refresh counts from the server so we always show the latest
  // value even if the server rendered with data that predates a recent vote.
  useEffect(() => {
    if (small) return;
    fetch(`/api/pages/vote?keyName=${encodeURIComponent(keyName)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setUpvotes(data.upvotes ?? 0);
        setDownvotes(data.downvotes ?? 0);
      })
      .catch(() => {});
  }, [keyName, small]);

  const cast = async (dir, e) => {
    e?.stopPropagation();
    if (myVote !== null && myVote !== dir) return;

    const isUndo = myVote === dir;
    const res = await fetch("/api/pages/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyName, voteType: dir, remove: isUndo }),
    });
    if (res.status === 409 || !res.ok) return;

    if (isUndo) {
      if (dir === "up") setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
      setMyVote(null);
      clearVote(`page:${keyName}`);
    } else {
      if (dir === "up") setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
      setMyVote(dir);
      persistVote(`page:${keyName}`, dir);
    }
  };

  const net = Math.max(-1, upvotes - downvotes);
  const upDisabled = myVote !== null && myVote !== "up";
  const downDisabled = myVote !== null && myVote !== "down";

  if (small) {
    const btnCls = (dir, disabled) =>
      `border rounded px-1.5 py-0.5 transition-colors ${
        myVote === dir
          ? dir === "up"
            ? "text-green-400 border-green-700 bg-green-950"
            : "text-red-400 border-red-700 bg-red-950"
          : disabled
          ? "text-gray-600 border-gray-800 cursor-not-allowed"
          : dir === "up"
          ? "text-gray-300 border-gray-700 hover:text-green-400"
          : "text-gray-300 border-gray-700 hover:text-red-400"
      }`;

    return (
      <div className="flex items-center gap-1 text-xs">
        <button onClick={(e) => cast("up", e)} disabled={upDisabled} className={btnCls("up", upDisabled)}>
          ▲
        </button>
        <span className="text-gray-300 min-w-[1rem] text-center">{net}</span>
        <button onClick={(e) => cast("down", e)} disabled={downDisabled} className={btnCls("down", downDisabled)}>
          ▼
        </button>
      </div>
    );
  }

  const base = "flex items-center gap-1 border rounded px-3 py-1 transition-colors text-sm";
  const upCls =
    myVote === "up"
      ? `${base} text-green-400 border-green-700 bg-green-950 drop-shadow-[0_0_8px_#22c55e]`
      : upDisabled
      ? `${base} text-gray-600 border-gray-800 cursor-not-allowed`
      : `${base} text-gray-300 border-gray-700 hover:text-green-400`;
  const downCls =
    myVote === "down"
      ? `${base} text-red-400 border-red-700 bg-red-950 drop-shadow-[0_0_8px_#ef4444]`
      : downDisabled
      ? `${base} text-gray-600 border-gray-800 cursor-not-allowed`
      : `${base} text-gray-300 border-gray-700 hover:text-red-400`;

  return (
    <div className="flex items-center gap-2">
      <button onClick={(e) => cast("up", e)} disabled={upDisabled} className={upCls}>
        ▲ {upvotes}
      </button>
      <span className="text-gray-400 font-bold min-w-[1.5rem] text-center text-sm">{net}</span>
      <button onClick={(e) => cast("down", e)} disabled={downDisabled} className={downCls}>
        ▼ {downvotes}
      </button>
    </div>
  );
}
