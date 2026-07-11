"use client";
import { useState, useEffect } from "react";
import AnonAvatar from "./AnonAvatar";

// ── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = "dbu_comment_votes";

function readVotes() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveVote(key, direction) {
  try {
    const votes = readVotes();
    votes[key] = direction;
    localStorage.setItem(LS_KEY, JSON.stringify(votes));
  } catch {}
}

// ── useVote hook ─────────────────────────────────────────────────────────────
//
// voteKey  – unique string that identifies this votable entity
// payload  – body sent to /api/comments/vote

function useVote(voteKey, payload) {
  // null = not voted; "up"/"down" = voted; "blocked" = server rejected (other device)
  const [myVote, setMyVote] = useState(null);

  useEffect(() => {
    const stored = readVotes()[voteKey];
    if (stored) setMyVote(stored);
  }, [voteKey]);

  // onChange(delta) — caller increments/decrements its count state by delta (+1 or -1)
  const castVote = async (direction, onChange) => {
    // Block only if voted in the OTHER direction or server-blocked
    if (myVote !== null && myVote !== direction) return;

    const isUndo = myVote === direction;

    const res = await fetch("/api/comments/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, voteType: direction, remove: isUndo }),
    });

    if (res.status === 409) {
      setMyVote("blocked");
      return;
    }
    if (!res.ok) return;

    if (isUndo) {
      setMyVote(null);
      try {
        const stored = readVotes();
        delete stored[voteKey];
        localStorage.setItem(LS_KEY, JSON.stringify(stored));
      } catch {}
      onChange(-1);
    } else {
      setMyVote(direction);
      saveVote(voteKey, direction);
      onChange(1);
    }
  };

  return { myVote, castVote };
}

// ── VoteButtons ───────────────────────────────────────────────────────────────

function VoteButtons({ myVote, upvotes, downvotes, onVote, small = false }) {
  const base = small
    ? "flex items-center gap-1 text-xs border rounded px-2 py-0.5 transition-colors cursor-pointer"
    : "flex items-center gap-1 text-sm border rounded px-3 py-1 transition-colors cursor-pointer";

  // Each button is only disabled when the OTHER direction (or server-block) is active.
  // Clicking your own active vote un-votes it.
  const upDisabled = myVote !== null && myVote !== "up";
  const downDisabled = myVote !== null && myVote !== "down";

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
    <>
      <button onClick={() => onVote("up")} className={upCls} disabled={upDisabled}>
        ▲ {upvotes}
      </button>
      <button onClick={() => onVote("down")} className={downCls} disabled={downDisabled}>
        ▼ {downvotes}
      </button>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTimestamp(ts) {
  const d = new Date(ts);
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${d.getFullYear()} ${hour}:${min}`;
}

function Avatar({ image, name, size, isAuthor = false }) {
  const strokeCls = isAuthor ? "ring-2 ring-white ring-offset-1 ring-offset-gray-950" : "";
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        style={{ width: size, height: size, minWidth: size }}
        className={`rounded-full object-cover ${strokeCls}`}
      />
    );
  }
  return <AnonAvatar size={size} className={strokeCls} />;
}

function InlineReplyInput({ onSubmit, onCancel }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(text.trim());
    setText("");
    setSubmitting(false);
  };

  return (
    <div className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        rows={3}
        className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:border-gray-500"
      />
      <div className="flex gap-3 mt-1">
        <button
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="text-amber-500 hover:text-amber-400 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Submit
        </button>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-400 text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── ReplyItem ─────────────────────────────────────────────────────────────────
// depth 0 = top-level reply (can have sub-replies + reply input)
// depth 1 = sub-reply (vote only, no further nesting)

function ReplyItem({ reply, commentId, parentReplyId = null, depth = 0 }) {
  const voteKey =
    depth === 0
      ? `r:${commentId}:${reply._id}`
      : `sr:${commentId}:${parentReplyId}:${reply._id}`;

  const { myVote, castVote } = useVote(voteKey, {
    commentId,
    replyId: reply._id,
    parentReplyId,
  });

  const [upvotes, setUpvotes] = useState(reply.upvotes || 0);
  const [downvotes, setDownvotes] = useState(reply.downvotes || 0);
  const [subReplies, setSubReplies] = useState(reply.replies || []);
  const [visibleSubReplies, setVisibleSubReplies] = useState(5);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showSubReplies, setShowSubReplies] = useState(false);

  const vote = (dir) =>
    castVote(dir, (delta) => {
      if (dir === "up") setUpvotes((v) => v + delta);
      else setDownvotes((v) => v + delta);
    });

  const submitSubReply = async (text) => {
    const res = await fetch("/api/comments/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, parentReplyId: reply._id, text }),
    });
    const newReply = await res.json();
    setSubReplies((prev) => [...prev, newReply]);
    setShowSubReplies(true);
    setShowReplyInput(false);
  };

  return (
    <div className="border-l-2 border-gray-700 pl-4 mt-3">
      <div className="flex gap-3">
        <Avatar image={reply.userImage} name={reply.userName} size={32} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <span className="text-gray-300 text-sm font-medium">{reply.userName}</span>
            <span className="text-amber-500 text-xs whitespace-nowrap">
              {formatTimestamp(reply.timestamp)}
            </span>
          </div>
          <p className="text-gray-200 text-sm mt-1 whitespace-pre-wrap wrap-break-word leading-relaxed">
            {reply.text}
          </p>
          <div className="flex gap-3 mt-2 items-center flex-wrap justify-end">
            <VoteButtons
              myVote={myVote}
              upvotes={upvotes}
              downvotes={downvotes}
              onVote={vote}
              small
            />
            {depth === 0 && (
              <>
                {subReplies.length > 0 && (
                  <button
                    onClick={() => setShowSubReplies((v) => !v)}
                    className="text-amber-500 hover:text-amber-400 text-xs transition-colors"
                  >
                    ↩ Replies ({subReplies.length})
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowReplyInput((v) => !v);
                    setShowSubReplies(true);
                  }}
                  className="text-amber-500 hover:text-amber-400 text-xs transition-colors cursor-pointer"
                >
                  ↩ Reply
                </button>
              </>
            )}
          </div>

          {showReplyInput && depth === 0 && (
            <InlineReplyInput
              onSubmit={submitSubReply}
              onCancel={() => setShowReplyInput(false)}
            />
          )}

          {showSubReplies && depth === 0 && subReplies.length > 0 && (
            <div>
              {subReplies.slice(0, visibleSubReplies).map((sub) => (
                <ReplyItem
                  key={sub._id}
                  reply={sub}
                  commentId={commentId}
                  parentReplyId={reply._id}
                  depth={1}
                />
              ))}
              {visibleSubReplies < subReplies.length && (
                <button
                  onClick={() => setVisibleSubReplies((v) => v + 5)}
                  className="text-amber-500 hover:text-amber-400 text-xs mt-2 transition-colors cursor-pointer"
                >
                  Load more replies ({subReplies.length - visibleSubReplies} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CommentItem ───────────────────────────────────────────────────────────────

export default function CommentItem({ comment, pageAuthor, viewerIsAdmin = false, onDelete }) {
  const { myVote, castVote } = useVote(`c:${comment._id}`, {
    commentId: comment._id,
  });

  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes || 0);
  const [replies, setReplies] = useState(comment.replies || []);
  const [visibleReplies, setVisibleReplies] = useState(5);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const vote = (dir) =>
    castVote(dir, (delta) => {
      if (dir === "up") setUpvotes((v) => v + delta);
      else setDownvotes((v) => v + delta);
    });

  const submitReply = async (text) => {
    const res = await fetch("/api/comments/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: comment._id, text }),
    });
    const newReply = await res.json();
    setReplies((prev) => [...prev, newReply]);
    setShowReplies(true);
    setShowReplyInput(false);
  };

  const isAuthor = !!pageAuthor && comment.userName === pageAuthor;
  const commenterIsAdmin = !!comment.isAdmin;

  const handleDelete = async () => {
    if (deleting || !onDelete) return;
    setDeleting(true);
    await onDelete(comment._id);
    setDeleting(false);
  };

  return (
    <div className="border-t border-gray-800 py-5">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <Avatar image={comment.userImage} name={comment.userName} size={48} isAuthor={isAuthor} />
          <span className="text-gray-400 text-xs text-center max-w-15 wrap-break-word leading-tight">
            {comment.userName}
          </span>
          {isAuthor && (
            <span className="text-[0.55rem] text-gray-200 font-semibold tracking-wide uppercase border border-gray-400 rounded px-1.5 py-0.5">
              Author
            </span>
          )}
          {commenterIsAdmin && !isAuthor && (
            <span className="text-[0.55rem] text-amber-400 font-semibold tracking-wide uppercase border border-amber-500 rounded px-1.5 py-0.5">
              Admin
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-end">
            <span className="text-amber-500 text-sm">
              {formatTimestamp(comment.timestamp)}
            </span>
          </div>
          <p className="text-gray-200 mt-1 whitespace-pre-wrap wrap-break-word leading-relaxed">
            {comment.text}
          </p>

          <div className="flex gap-3 mt-3 items-center flex-wrap justify-end">
            <VoteButtons
              myVote={myVote}
              upvotes={upvotes}
              downvotes={downvotes}
              onVote={vote}
            />
            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="text-amber-500 hover:text-amber-400 text-sm transition-colors cursor-pointer"
              >
                ↩ Replies ({replies.length})
              </button>
            )}
            <button
              onClick={() => {
                setShowReplyInput((v) => !v);
                setShowReplies(true);
              }}
              className="text-amber-500 hover:text-amber-400 text-sm transition-colors cursor-pointer"
            >
              ↩ Reply
            </button>
            {viewerIsAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-500 hover:text-red-400 text-sm transition-colors cursor-pointer disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>

          {showReplyInput && (
            <InlineReplyInput
              onSubmit={submitReply}
              onCancel={() => setShowReplyInput(false)}
            />
          )}

          {showReplies && replies.length > 0 && (
            <div className="mt-2">
              {replies.slice(0, visibleReplies).map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  commentId={comment._id}
                  depth={0}
                />
              ))}
              {visibleReplies < replies.length && (
                <button
                  onClick={() => setVisibleReplies((v) => v + 5)}
                  className="text-amber-500 hover:text-amber-400 text-sm mt-3 transition-colors cursor-pointer"
                >
                  Load more replies ({replies.length - visibleReplies} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
