"use client";
import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import AnonAvatar from "./AnonAvatar";

export default function CommentSection({ pageKey, session }) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/comments?pageKey=${encodeURIComponent(pageKey)}&skip=0`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setComments(data.comments ?? []);
        setTotal(data.total ?? 0);
        setSkip(20);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [pageKey]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/comments?pageKey=${encodeURIComponent(pageKey)}&skip=${skip}`
      );
      const data = await res.json();
      setComments((prev) => [...prev, ...(data.comments ?? [])]);
      setSkip((s) => s + 20);
    } finally {
      setLoadingMore(false);
    }
  };

  const submitComment = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, text: text.trim() }),
      });
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setTotal((t) => t + 1);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const user = session?.user;

  return (
    <div className="w-full mt-12 border-t border-gray-700 pt-8">
      <h2 className="text-xl font-bold text-gray-200 mb-6">Comments</h2>

      {/* Comment input */}
      <div className="flex gap-4 mb-8">
        <div className="flex-shrink-0 pt-1">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <AnonAvatar size={48} />
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Input your comments:"
            rows={4}
            className="w-full bg-gray-950 border border-gray-700 text-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-gray-500 text-sm"
          />
          <button
            onClick={submitComment}
            disabled={submitting || !text.trim()}
            className="mt-2 w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-200 rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            ✈ Submit
          </button>
          {!user && (
            <p className="text-gray-500 text-xs mt-2 text-center">
              Posting as Anonymous Warrior.{" "}
              <a href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
                Sign in
              </a>{" "}
              to use your account.
            </p>
          )}
        </div>
      </div>

      {/* Comment list */}
      {loading ? (
        <p className="text-gray-500 text-sm py-4">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">No comments yet. Be the first!</p>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
          {comments.length < total && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full mt-4 py-2 text-amber-500 hover:text-amber-400 text-sm border border-gray-700 rounded-lg transition-colors disabled:opacity-40"
            >
              {loadingMore
                ? "Loading…"
                : `Load more comments (${total - comments.length} remaining)`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
