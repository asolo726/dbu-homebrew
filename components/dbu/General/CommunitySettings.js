"use client";
import { useState, useEffect } from "react";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiDeleteBinLine, RiLoader4Line } from "react-icons/ri";

export default function CommunitySettings({ keyName, isCommunity: initialIsCommunity }) {
  const ctx = useEditMode();
  const { isEditing, isAdmin, pendingChanges, setChange } = ctx || {};

  if (!isEditing) return null;

  const currentIsCommunity = pendingChanges?.["head.isCommunity"] ?? initialIsCommunity ?? false;

  return <CommunitySettingsPanel
    keyName={keyName}
    currentIsCommunity={currentIsCommunity}
    isAdmin={isAdmin}
    setChange={setChange}
  />;
}

// Separate inner component so hooks aren't conditional
function CommunitySettingsPanel({ keyName, currentIsCommunity, isAdmin, setChange }) {
  const [allowlist, setAllowlist] = useState([]);
  const [allowlistLoading, setAllowlistLoading] = useState(false);
  const [addUsername, setAddUsername] = useState("");
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!currentIsCommunity) { setAllowlist([]); return; }
    setAllowlistLoading(true);
    fetch(`/api/community/allowlist?keyName=${encodeURIComponent(keyName)}`)
      .then((r) => r.json())
      .then((data) => setAllowlist(data.members ?? []))
      .catch(() => {})
      .finally(() => setAllowlistLoading(false));
  }, [currentIsCommunity, keyName]);

  async function handleAdd() {
    if (!addUsername.trim() || addLoading) return;
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/community/allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName, username: addUsername.trim() }),
      });
      const data = await res.json();
      if (res.ok) { setAllowlist(data.members); setAddUsername(""); }
      else setAddError(data.error ?? "User not found");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemove(email) {
    const res = await fetch("/api/community/allowlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyName, email }),
    });
    if (res.ok) { const data = await res.json(); setAllowlist(data.members); }
  }

  return (
    <div className="border border-blue-400/40 rounded-xl p-4 bg-blue-950/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-blue-300 font-semibold tracking-wide text-sm uppercase">
          Community Settings
        </h4>
        {isAdmin && (
          <button
            onClick={() => setChange?.("head.isCommunity", !currentIsCommunity)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
              currentIsCommunity
                ? "border-blue-400 text-blue-300 bg-blue-900/30 hover:bg-red-900/20 hover:text-red-300 hover:border-red-400"
                : "border-dbu-line text-dbu-text/60 hover:border-blue-400 hover:text-blue-300"
            }`}
          >
            {currentIsCommunity ? "Disable Community" : "Enable Community"}
          </button>
        )}
      </div>

      {currentIsCommunity && (
        <>
          <p className="text-xs text-dbu-text/50 mb-3">
            Allowlisted users can add new contributions but cannot edit others&apos; entries.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={addUsername}
              onChange={(e) => { setAddUsername(e.target.value); setAddError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Username to add..."
              className="flex-1 bg-dbu-bg2 border border-dbu-line rounded px-3 py-1.5 text-sm text-dbu-text placeholder-dbu-text/40 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleAdd}
              disabled={addLoading || !addUsername.trim()}
              title="Add user to allowlist"
              className="flex items-center gap-1 px-3 py-1.5 rounded text-sm border border-blue-400/50 text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {addLoading ? <RiLoader4Line size={14} className="animate-spin" /> : <RiAddFill size={14} />}
              Add
            </button>
          </div>
          {addError && <p className="text-red-400 text-xs mb-2">{addError}</p>}

          {allowlistLoading ? (
            <p className="text-xs text-dbu-text/40 flex items-center gap-1">
              <RiLoader4Line size={12} className="animate-spin" /> Loading...
            </p>
          ) : allowlist.length === 0 ? (
            <p className="text-xs text-dbu-text/40">No users in allowlist yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {allowlist.map(({ email, name }) => (
                <li key={email} className="flex items-center justify-between bg-dbu-bg2 rounded px-3 py-1.5">
                  <span className="text-sm text-dbu-text">{name}</span>
                  <button
                    onClick={() => handleRemove(email)}
                    title="Remove from allowlist"
                    className="text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
