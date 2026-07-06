"use client";
import { useState, useEffect } from "react";
import Card from "../../app/search/card";

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
        ${checked ? "bg-dbu-link" : "bg-dbu-line"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

const DEFAULT_NOTIF_SETTINGS = {
  masterEnabled: true,
  comments: { mode: "replies-only" },
  upvotes: { enabled: true },
  views: { enabled: true },
};

export default function SettingsClient({ user, pageData }) {
  const [activeTab, setActiveTab] = useState("account");

  // ── Account tab state ──────────────────────────────────────────────────────
  const [username, setUsername] = useState(user.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(user.name || "");
  const [showModal, setShowModal] = useState(false);
  const [pendingNewName, setPendingNewName] = useState("");
  const [authoredQuery, setAuthoredQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Notification tab state ─────────────────────────────────────────────────
  const [notifSettings, setNotifSettings] = useState(null);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [notifSuccess, setNotifSuccess] = useState("");

  useEffect(() => {
    if (activeTab === "notifications" && notifSettings === null && !notifLoading) {
      setNotifLoading(true);
      fetch("/api/settings/notifications")
        .then((r) => r.json())
        .then((data) => {
          setNotifSettings(data);
          setNotifLoading(false);
        })
        .catch(() => {
          setNotifError("Failed to load notification settings.");
          setNotifLoading(false);
        });
    }
  }, [activeTab]);

  const updateNotif = (path, value) => {
    setNotifSettings((prev) => {
      const next = { ...prev };
      if (path === "masterEnabled") next.masterEnabled = value;
      else if (path === "comments.mode") next.comments = { ...next.comments, mode: value };
      else if (path === "upvotes.enabled") next.upvotes = { ...next.upvotes, enabled: value };
      else if (path === "views.enabled") next.views = { ...next.views, enabled: value };
      return next;
    });
  };

  const saveNotifSettings = async () => {
    setNotifSaving(true);
    setNotifError("");
    setNotifSuccess("");
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifSettings),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }
      setNotifSuccess("Saved!");
      setTimeout(() => setNotifSuccess(""), 3000);
    } catch (err) {
      setNotifError(err.message);
    } finally {
      setNotifSaving(false);
    }
  };

  // ── Authored pages helpers ─────────────────────────────────────────────────
  const allEntries = Object.values(pageData.Response).flat();
  const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");
  const authoredEntries = allEntries.filter((e) => e.head.author === username);
  const filteredEntries = authoredEntries.filter(
    (e) =>
      !authoredQuery.trim() ||
      normalize(e.head.title).includes(normalize(authoredQuery))
  );

  // ── Account save helpers ───────────────────────────────────────────────────
  const handleSaveClick = async () => {
    const trimmed = editValue.trim();
    setSaveError("");
    if (!trimmed || trimmed === username) {
      setIsEditing(false);
      setEditValue(username);
      return;
    }
    const hasPages = allEntries.some((e) => e.head.author === username);
    if (hasPages) {
      setPendingNewName(trimmed);
      setShowModal(true);
    } else {
      await commitChange(trimmed, false);
    }
  };

  const commitChange = async (newName, updateAuthor) => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/settings/updateUsername", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Update failed");
      }
      if (updateAuthor) {
        const res2 = await fetch("/api/settings/updateAuthorName", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldName: username, newName }),
        });
        if (!res2.ok) throw new Error(`Author update failed (${res2.status})`);
      }
      setUsername(newName);
      setEditValue(newName);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleModalYes = async () => {
    setShowModal(false);
    await commitChange(pendingNewName, true);
    setPendingNewName("");
  };

  const handleModalNo = async () => {
    setShowModal(false);
    await commitChange(pendingNewName, false);
    setPendingNewName("");
  };

  // ── Tab styling ────────────────────────────────────────────────────────────
  const tabClass = (tab) =>
    `w-full text-left px-5 py-4 text-sm transition-colors border-b border-dbu-line ` +
    (activeTab === tab
      ? "bg-[#2e2e2e] text-dbu-header"
      : "text-dbu-text hover:bg-[#292929] hover:text-dbu-header");

  const notif = notifSettings ?? DEFAULT_NOTIF_SETTINGS;
  const masterOn = notif.masterEnabled;

  return (
    <div className="flex w-full">
      {/* Left sidebar */}
      <div className="w-52 shrink-0 border-r border-dbu-line flex flex-col">
        <button onClick={() => setActiveTab("account")} className={tabClass("account")}>
          Account Settings
        </button>
        <button onClick={() => setActiveTab("authored")} className={tabClass("authored")}>
          Authored Pages
        </button>
        <button onClick={() => setActiveTab("notifications")} className={tabClass("notifications")}>
          Notification Settings
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 min-w-0">

        {/* ── Account tab ───────────────────────────────────────────────────── */}
        {activeTab === "account" && (
          <div className="flex flex-col items-center gap-10 max-w-2xl mx-auto pt-8">
            <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-dbu-line shrink-0">
              <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <div className="w-full">
              <label className="block text-sm text-dbu-text/50 mb-2 ml-1">Username</label>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <input
                      className="flex-1 px-4 py-3 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text focus:outline-none focus:border-dbu-header text-base"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveClick()}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveClick}
                      disabled={saving}
                      className="shrink-0 px-5 py-3 rounded-md text-sm bg-dbu-link text-white hover:bg-dbu-link/90 disabled:opacity-50 transition-colors"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setEditValue(username); setSaveError(""); }}
                      disabled={saving}
                      className="shrink-0 px-4 py-3 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 px-4 py-3 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text text-base">
                      {username}
                    </div>
                    <button
                      onClick={() => { setIsEditing(true); setSaveError(""); }}
                      className="shrink-0 px-5 py-3 rounded-md text-sm border border-green-600 text-green-500 hover:bg-green-900/20 transition-colors"
                    >
                      Change
                    </button>
                  </>
                )}
              </div>
              {saveError && <p className="text-red-400 text-xs mt-1 ml-1">{saveError}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm text-dbu-text/50 mb-2 ml-1">Email</label>
              <div className="px-4 py-3 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text/60 text-base select-all">
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* ── Authored pages tab ────────────────────────────────────────────── */}
        {activeTab === "authored" && (
          <div>
            <input
              type="text"
              value={authoredQuery}
              onChange={(e) => setAuthoredQuery(e.target.value)}
              placeholder="Search your pages…"
              className="w-full p-2 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text placeholder:text-dbu-text/40 focus:outline-none focus:border-dbu-header"
            />
            {filteredEntries.length === 0 ? (
              <p className="text-dbu-text/40 mt-12 text-center text-sm">
                {authoredEntries.length === 0
                  ? "You haven't authored any pages yet."
                  : "No pages match your search."}
              </p>
            ) : (
              <div
                className="grid gap-6 mt-6 mb-4"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
              >
                {filteredEntries.map((entry, i) => (
                  <Card
                    key={i}
                    link={`/${entry.head.keyName}`}
                    imageUrl={entry.head.banner}
                    pageName={entry.head.title}
                    pageType={entry.head.identity}
                    raceRestriction={entry.head.raceReq}
                    tierOfPower={entry.head.tier}
                    author={entry.head.author}
                    enhancementType={entry.head.enhancementType}
                    awakeningType={entry.head.awakeningType}
                    awakeningOrigin={entry.head.awakeningOrigin}
                    tag={entry.head.tag}
                    keyName={entry.head.keyName}
                    upvotes={entry.head.upvotes ?? 0}
                    views={entry.head.views ?? 0}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Notification Settings tab ─────────────────────────────────────── */}
        {activeTab === "notifications" && (
          <div className="max-w-2xl mx-auto pt-2">
            <h2 className="text-xl font-semibold text-dbu-header mb-1">Email Notifications</h2>
            <p className="text-sm text-dbu-text/50 mb-8">
              Notifications are sent to <span className="text-dbu-text/80">{user.email}</span>
            </p>

            {notifLoading && (
              <p className="text-dbu-text/40 text-sm">Loading…</p>
            )}

            {!notifLoading && (
              <div className="flex flex-col gap-5">

                {/* Master toggle */}
                <div className="flex items-center justify-between px-5 py-4 bg-dbu-bg2 border border-dbu-line rounded-lg">
                  <div>
                    <p className="text-dbu-header font-medium text-sm">Enable All Email Notifications</p>
                    <p className="text-xs text-dbu-text/50 mt-0.5">Master switch — overrides all settings below</p>
                  </div>
                  <Toggle
                    checked={notif.masterEnabled}
                    onChange={(val) => updateNotif("masterEnabled", val)}
                  />
                </div>

                {/* Comments */}
                <div className={`transition-opacity ${!masterOn ? "opacity-40 pointer-events-none" : ""}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-dbu-text/40 mb-2 ml-1">
                    Comments
                  </p>
                  <div className="bg-dbu-bg2 border border-dbu-line rounded-lg overflow-hidden">
                    {[
                      {
                        value: "all",
                        label: "All comments on my pages",
                        desc: "Get emailed whenever anyone comments on a page you authored",
                      },
                      {
                        value: "replies-only",
                        label: "Replies to my comments only",
                        desc: "Only get emailed when someone replies directly to a comment you made",
                      },
                      {
                        value: "disabled",
                        label: "Disabled",
                        desc: "No email notifications for comments or replies",
                      },
                    ].map((opt, idx, arr) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#292929] transition-colors
                          ${idx < arr.length - 1 ? "border-b border-dbu-line" : ""}`}
                      >
                        <input
                          type="radio"
                          name="commentsMode"
                          value={opt.value}
                          checked={notif.comments.mode === opt.value}
                          onChange={() => updateNotif("comments.mode", opt.value)}
                          className="mt-0.5 accent-dbu-link shrink-0"
                        />
                        <div>
                          <p className="text-dbu-text text-sm font-medium">{opt.label}</p>
                          <p className="text-dbu-text/50 text-xs mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upvotes */}
                <div className={`transition-opacity ${!masterOn ? "opacity-40 pointer-events-none" : ""}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-dbu-text/40 mb-2 ml-1">
                    Upvotes
                  </p>
                  <div className="flex items-center justify-between px-5 py-4 bg-dbu-bg2 border border-dbu-line rounded-lg">
                    <div>
                      <p className="text-dbu-text text-sm font-medium">Upvote milestones</p>
                      <p className="text-dbu-text/50 text-xs mt-0.5">
                        Email me when one of my pages reaches 10, 100, or 500 upvotes
                      </p>
                    </div>
                    <Toggle
                      checked={notif.upvotes.enabled}
                      onChange={(val) => updateNotif("upvotes.enabled", val)}
                    />
                  </div>
                </div>

                {/* Views */}
                <div className={`transition-opacity ${!masterOn ? "opacity-40 pointer-events-none" : ""}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-dbu-text/40 mb-2 ml-1">
                    Views
                  </p>
                  <div className="flex items-center justify-between px-5 py-4 bg-dbu-bg2 border border-dbu-line rounded-lg">
                    <div>
                      <p className="text-dbu-text text-sm font-medium">View milestones</p>
                      <p className="text-dbu-text/50 text-xs mt-0.5">
                        Email me when one of my pages reaches 100, 1,000, or 10,000 views
                      </p>
                    </div>
                    <Toggle
                      checked={notif.views.enabled}
                      onChange={(val) => updateNotif("views.enabled", val)}
                    />
                  </div>
                </div>

                {/* Save row */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  {notifError && <p className="text-red-400 text-xs">{notifError}</p>}
                  {notifSuccess && <p className="text-green-400 text-xs">{notifSuccess}</p>}
                  <button
                    onClick={saveNotifSettings}
                    disabled={notifSaving}
                    className="px-5 py-2.5 rounded-md text-sm bg-dbu-link text-white hover:bg-dbu-link/90 disabled:opacity-50 transition-colors"
                  >
                    {notifSaving ? "Saving…" : "Save"}
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Author name update modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dbu-bg2 border border-dbu-line rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-dbu-header text-lg font-semibold mb-3">Update Author Name?</h2>
            <p className="text-dbu-text text-sm mb-6">
              You have pages listed under{" "}
              <span className="text-dbu-header font-medium">"{username}"</span>.
              Would you like to update the Author field on those pages to{" "}
              <span className="text-dbu-header font-medium">"{pendingNewName}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleModalNo}
                className="px-4 py-2 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
              >
                No
              </button>
              <button
                onClick={handleModalYes}
                className="px-4 py-2 rounded-md text-sm bg-dbu-link text-white hover:bg-dbu-link/90 transition-colors"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
