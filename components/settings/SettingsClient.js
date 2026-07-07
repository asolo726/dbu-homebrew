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

export default function SettingsClient({ user, pageData }) {
  const [activeTab, setActiveTab] = useState("account");

  // ── Account tab ────────────────────────────────────────────────────────────
  const [username, setUsername] = useState(user.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(user.name || "");
  const [showModal, setShowModal] = useState(false);
  const [pendingNewName, setPendingNewName] = useState("");
  const [authoredQuery, setAuthoredQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Toggle tab ─────────────────────────────────────────────────────────────
  const [toggleList, setToggleList] = useState([]);
  const [togglePage, setTogglePage] = useState(1);
  const [toggleTotal, setToggleTotal] = useState(0);
  const [toggleTotalPages, setToggleTotalPages] = useState(1);
  const [togglesLoading, setTogglesLoading] = useState(false);

  // ── Toggle popup ───────────────────────────────────────────────────────────
  const [popupToggle, setPopupToggle] = useState(null);
  const [popupLeft, setPopupLeft] = useState([]);   // pages WITH toggle
  const [popupRight, setPopupRight] = useState([]); // pages WITHOUT toggle
  const [origLeft, setOrigLeft] = useState([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupSaving, setPopupSaving] = useState(false);
  const [popupError, setPopupError] = useState("");
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // ── Load toggles when tab opens or page changes ────────────────────────────
  useEffect(() => {
    if (activeTab !== "toggles") return;
    setTogglesLoading(true);
    fetch(`/api/settings/toggles?page=${togglePage}`)
      .then((r) => r.json())
      .then((data) => {
        setToggleList(data.toggles ?? []);
        setToggleTotal(data.total ?? 0);
        setToggleTotalPages(data.totalPages ?? 1);
      })
      .catch(() => {})
      .finally(() => setTogglesLoading(false));
  }, [activeTab, togglePage]);

  const handleToggleSwitch = async (name, enabled) => {
    setToggleList((prev) => prev.map((t) => (t.name === name ? { ...t, enabled } : t)));
    await fetch("/api/settings/toggles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toggleName: name, enabled }),
    });
  };

  const openTogglePopup = async (name) => {
    setPopupToggle(name);
    setPopupLoading(true);
    setPopupLeft([]);
    setPopupRight([]);
    setOrigLeft([]);
    setPopupError("");
    try {
      const r = await fetch(`/api/settings/toggles/pages?toggle=${encodeURIComponent(name)}`);
      const data = await r.json();
      setPopupLeft(data.withToggle ?? []);
      setPopupRight(data.withoutToggle ?? []);
      setOrigLeft(data.withToggle ?? []);
    } catch {
      setPopupError("Failed to load pages.");
    }
    setPopupLoading(false);
  };

  const moveToRight = (page) => {
    setPopupLeft((prev) => prev.filter((p) => p.keyName !== page.keyName));
    setPopupRight((prev) => [...prev, page]);
  };

  const moveToLeft = (page) => {
    setPopupRight((prev) => prev.filter((p) => p.keyName !== page.keyName));
    setPopupLeft((prev) => [...prev, page]);
  };

  const popupHasChanges = () => {
    const origSet = new Set(origLeft.map((p) => p.keyName));
    const currSet = new Set(popupLeft.map((p) => p.keyName));
    if (origSet.size !== currSet.size) return true;
    for (const k of origSet) if (!currSet.has(k)) return true;
    return false;
  };

  const handleBackdropClick = () => {
    if (popupHasChanges()) {
      setShowUnsavedWarning(true);
    } else {
      setPopupToggle(null);
    }
  };

  const savePopupChanges = async () => {
    setPopupSaving(true);
    setPopupError("");
    const origSet = new Set(origLeft.map((p) => p.keyName));
    const currSet = new Set(popupLeft.map((p) => p.keyName));
    const addPages = popupLeft.filter((p) => !origSet.has(p.keyName));
    const removePages = origLeft.filter((p) => !currSet.has(p.keyName));
    try {
      const r = await fetch("/api/settings/toggles/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleName: popupToggle, addPages, removePages }),
      });
      if (!r.ok) throw new Error("Save failed");
      setOrigLeft([...popupLeft]);
      setPopupToggle(null);
    } catch (err) {
      setPopupError(err.message);
    }
    setPopupSaving(false);
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

  const tabClass = (tab) =>
    `w-full text-left px-5 py-4 text-sm transition-colors border-b border-dbu-line cursor-pointer ` +
    (activeTab === tab
      ? "bg-[#2e2e2e] text-dbu-header"
      : "text-dbu-text hover:bg-[#292929] hover:text-dbu-header");

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
        <button onClick={() => setActiveTab("toggles")} className={tabClass("toggles")}>
          Page Toggles
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
                      className="shrink-0 px-5 py-3 rounded-md text-sm bg-dbu-link text-white hover:bg-dbu-link/90 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setEditValue(username); setSaveError(""); }}
                      disabled={saving}
                      className="shrink-0 px-4 py-3 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header disabled:opacity-50 transition-colors cursor-pointer"
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
                      className="shrink-0 px-5 py-3 rounded-md text-sm border border-green-600 text-green-500 hover:bg-green-900/20 transition-colors cursor-pointer "
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
                {filteredEntries.map((entry) => (
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

        {/* ── Page Toggles tab ──────────────────────────────────────────────── */}
        {activeTab === "toggles" && (
          <div className="max-w-3xl mx-auto pt-2">
            <h2 className="text-xl font-semibold text-dbu-header mb-1">Page Toggles</h2>
            <p className="text-sm text-dbu-text/50 mb-6">
              Toggles control page visibility. Click a toggle name to manage which pages it applies to.
            </p>

            {togglesLoading ? (
              <p className="text-dbu-text/40 text-sm">Loading…</p>
            ) : toggleTotal === 0 ? (
              <p className="text-dbu-text/50 text-sm mt-8 text-center">
                You do not have any Page Toggles. Create a new page to make one!
              </p>
            ) : (
              <>
                <div className="border border-dbu-line rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dbu-line bg-[#252525]">
                        <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-dbu-text/50">
                          Toggle Name
                        </th>
                        <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-dbu-text/50">
                          Enabled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {toggleList.map((t, idx) => (
                        <tr
                          key={t.name}
                          className={idx < toggleList.length - 1 ? "border-b border-dbu-line" : ""}
                        >
                          <td className="px-5 py-4">
                            <button
                              onClick={() => openTogglePopup(t.name)}
                              className="text-dbu-link text-sm hover:underline text-left cursor-pointer"
                            >
                              {t.name}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <Toggle
                                checked={t.enabled}
                                onChange={(val) => handleToggleSwitch(t.name, val)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {toggleTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => setTogglePage((p) => p - 1)}
                      disabled={togglePage <= 1}
                      className="px-3 py-1.5 text-xs rounded border border-dbu-line text-dbu-text hover:border-dbu-header disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-dbu-text/50">
                      Page {togglePage} of {toggleTotalPages}
                    </span>
                    <button
                      onClick={() => setTogglePage((p) => p + 1)}
                      disabled={togglePage >= toggleTotalPages}
                      className="px-3 py-1.5 text-xs rounded border border-dbu-line text-dbu-text hover:border-dbu-header disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Author name modal ──────────────────────────────────────────────── */}
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

      {/* ── Toggle page assignment popup ───────────────────────────────────── */}
      {popupToggle && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-dbu-bg2 border border-dbu-line rounded-lg w-full max-w-2xl mx-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup header */}
            <div className="px-6 py-4 border-b border-dbu-line">
              <h2 className="text-dbu-header font-semibold">{popupToggle}</h2>
              <p className="text-xs text-dbu-text/50 mt-0.5">
                Click a page name to move it to the other column. Save to apply.
              </p>
            </div>

            {/* Popup body */}
            {popupLoading ? (
              <div className="px-6 py-16 text-center text-dbu-text/40 text-sm">Loading…</div>
            ) : (
              <div className="grid grid-cols-2" style={{ minHeight: "280px" }}>
                {/* Left: pages WITH toggle */}
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-dbu-text/40 mb-3">
                    Pages with toggle ({popupLeft.length})
                  </p>
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {popupLeft.length === 0 ? (
                      <p className="text-dbu-text/30 text-xs italic">None</p>
                    ) : (
                      popupLeft.map((p) => (
                        <button
                          key={p.keyName}
                          onClick={() => moveToRight(p)}
                          title="Click to remove this toggle"
                          className="block w-full text-left px-3 py-2 text-sm text-dbu-text hover:bg-dbu-line rounded transition-colors truncate cursor-pointer"
                        >
                          {p.title}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: pages WITHOUT toggle */}
                <div className="border-l border-dbu-line px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-dbu-text/40 mb-3">
                    Pages without toggle ({popupRight.length})
                  </p>
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {popupRight.length === 0 ? (
                      <p className="text-dbu-text/30 text-xs italic">None</p>
                    ) : (
                      popupRight.map((p) => (
                        <button
                          key={p.keyName}
                          onClick={() => moveToLeft(p)}
                          title="Click to add this toggle"
                          className="block w-full text-left px-3 py-2 text-sm text-dbu-text hover:bg-dbu-line rounded transition-colors truncate cursor-pointer"
                        >
                          {p.title}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Popup footer */}
            <div className="px-6 py-4 border-t border-dbu-line flex items-center justify-between">
              <div>{popupError && <p className="text-red-400 text-xs">{popupError}</p>}</div>
              <div className="flex gap-3">
                <button
                  onClick={handleBackdropClick}
                  disabled={popupSaving}
                  className="px-4 py-2 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={savePopupChanges}
                  disabled={popupSaving || popupLoading}
                  className="px-4 py-2 rounded-md text-sm bg-dbu-link text-white hover:bg-dbu-link/90 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {popupSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Unsaved changes warning ────────────────────────────────────────── */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60">
          <div className="bg-dbu-bg2 border border-dbu-line rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-dbu-header font-semibold mb-2">Unsaved Changes</h3>
            <p className="text-dbu-text text-sm mb-5">
              You have unsaved changes to this toggle's page assignments. Close without saving?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUnsavedWarning(false)}
                className="px-4 py-2 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={() => { setShowUnsavedWarning(false); setPopupToggle(null); }}
                className="px-4 py-2 rounded-md text-sm bg-red-700 text-white hover:bg-red-600 transition-colors"
              >
                Close Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
