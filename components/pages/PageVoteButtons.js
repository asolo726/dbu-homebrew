"use client";
import { useState, useEffect } from "react";

const LS_KEY = "dbu_page_votes";

function readVotes() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}
function persistVote(key) {
  try {
    const v = readVotes(); v[key] = "up";
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
  small = false,
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const stored = readVotes()[`page:${keyName}`];
    if (stored) setVoted(true);
  }, [keyName]);

  useEffect(() => {
    if (small) return;
    fetch(`/api/pages/vote?keyName=${encodeURIComponent(keyName)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setUpvotes(data.upvotes ?? 0);
      })
      .catch(() => {});
  }, [keyName, small]);

  const cast = async (e) => {
    e?.stopPropagation();
    const isUndo = voted;
    const res = await fetch("/api/pages/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyName, voteType: "up", remove: isUndo }),
    });
    if (res.status === 409 || !res.ok) return;

    if (isUndo) {
      setUpvotes((v) => v - 1);
      setVoted(false);
      clearVote(`page:${keyName}`);
    } else {
      setUpvotes((v) => v + 1);
      setVoted(true);
      persistVote(`page:${keyName}`);
    }
  };

  if (small) {
    const btnCls = voted
      ? "border rounded px-1.5 py-0.5 transition-colors text-green-400 border-green-700 bg-green-950"
      : "border rounded px-1.5 py-0.5 transition-colors text-gray-300 border-gray-700 hover:text-green-400";

    return (
      <div className="flex items-center gap-1 text-xs">
        <button onClick={cast} className={btnCls}>
          ▲
        </button>
        <span className="text-gray-300 min-w-[1rem] text-center">{upvotes}</span>
      </div>
    );
  }

  const base = "flex items-center gap-1 border rounded px-3 py-1 transition-colors text-sm";
  const upCls = voted
    ? `${base} text-green-400 border-green-700 bg-green-950 drop-shadow-[0_0_8px_#22c55e]`
    : `${base} text-gray-300 border-gray-700 hover:text-green-400`;

  return (
    <div className="flex items-center gap-2">
      <button onClick={cast} className={upCls}>
        ▲ {upvotes}
      </button>
    </div>
  );
}
