"use client";
import { useState } from "react";
import Card from "../../app/search/card";

export default function SettingsClient({ user, pageData }) {
  const [activeTab, setActiveTab] = useState("account");
  const [username, setUsername] = useState(user.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(user.name || "");
  const [showModal, setShowModal] = useState(false);
  const [pendingNewName, setPendingNewName] = useState("");
  const [authoredQuery, setAuthoredQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const allEntries = Object.values(pageData.Response).flat();
  const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");

  const authoredEntries = allEntries.filter((e) => e.head.author === username);
  const filteredEntries = authoredEntries.filter(
    (e) =>
      !authoredQuery.trim() ||
      normalize(e.head.title).includes(normalize(authoredQuery))
  );

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

  const tabClass = (tab) =>
    `w-full text-left px-5 py-4 text-sm transition-colors border-b border-dbu-line ` +
    (activeTab === tab
      ? "bg-[#2e2e2e] text-dbu-header"
      : "text-dbu-text hover:bg-[#292929] hover:text-dbu-header");

  return (
    <div className="flex w-full">
      {/* Left sidebar — anchored to the page edge */}
      <div className="w-52 shrink-0 border-r border-dbu-line flex flex-col">
        <button onClick={() => setActiveTab("account")} className={tabClass("account")}>
          Account Settings
        </button>
        <button onClick={() => setActiveTab("authored")} className={tabClass("authored")}>
          Authored Pages
        </button>
      </div>

      {/* Main content — fills all remaining space */}
      <div className="flex-1 p-8 min-w-0">

        {activeTab === "account" && (
          <div className="flex flex-col items-center gap-10 max-w-2xl mx-auto pt-8">
            {/* Profile picture */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-dbu-line shrink-0">
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Username */}
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
                      onClick={() => {
                        setIsEditing(false);
                        setEditValue(username);
                        setSaveError("");
                      }}
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
              {saveError && (
                <p className="text-red-400 text-xs mt-1 ml-1">{saveError}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="w-full">
              <label className="block text-sm text-dbu-text/50 mb-2 ml-1">Email</label>
              <div className="px-4 py-3 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text/60 text-base select-all">
                {user.email}
              </div>
            </div>
          </div>
        )}

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
                    key={entry.head.keyName}
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
      </div>

      {/* Author name update modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dbu-bg2 border border-dbu-line rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-dbu-header text-lg font-semibold mb-3">
              Update Author Name?
            </h2>
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
