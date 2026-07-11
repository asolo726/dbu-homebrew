"use client";
import { useEditMode } from "./EditModeContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiPencilFill, RiSaveFill, RiCloseFill, RiArrowGoBackLine, RiArrowGoForwardLine, RiAddCircleFill } from "react-icons/ri";

export default function EditToolbar({ canEdit, canContribute }) {
  const { isEditing, setIsEditing, isContributing, setIsContributing, hasChanges, pendingChanges, clearChanges, keyName, undo, redo, canUndo, canRedo } = useEditMode();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error" | null
  const router = useRouter();

  const isActive = isEditing || isContributing;

  // Ctrl+Z / Ctrl+Y keyboard shortcuts (skip when user is in a text field)
  useEffect(() => {
    if (!isActive) return;
    function onKeyDown(e) {
      const active = document.activeElement;
      const isTextField =
        active?.tagName === "TEXTAREA" ||
        active?.tagName === "INPUT" ||
        active?.contentEditable === "true";
      if (isTextField) return;

      if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isActive, undo, redo]);

  async function handleSave() {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/updateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName, changes: pendingChanges }),
      });
      if (res.ok) {
        setSaveStatus("success");
        clearChanges();
        setIsEditing(false);
        setIsContributing(false);
        router.refresh();
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    clearChanges();
    setIsEditing(false);
    setIsContributing(false);
    setSaveStatus(null);
  }

  function toggleEditMode() {
    setIsEditing(!isEditing);
    setSaveStatus(null);
  }

  function toggleContributeMode() {
    setIsContributing(!isContributing);
    setSaveStatus(null);
  }

  const ghostBtn = "p-2.5 rounded-full shadow-lg transition-colors cursor-pointer bg-dbu-bg3 border border-dbu-line text-dbu-text hover:border-dbu-header hover:text-dbu-header disabled:opacity-25 disabled:cursor-not-allowed";

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
      {saveStatus === "error" && (
        <p className="text-red-400 text-sm bg-dbu-bg3 px-3 py-1 rounded">Failed to save.</p>
      )}
      {saveStatus === "success" && (
        <p className="text-green-400 text-sm bg-dbu-bg3 px-3 py-1 rounded">Saved!</p>
      )}
      {isActive && hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          title="Save changes"
          className="flex items-center gap-2 bg-dbu-header text-dbu-bg px-4 py-2 rounded-full font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
        >
          <RiSaveFill size={18} />
          {saving ? "Saving..." : "Save"}
        </button>
      )}
      {isActive && (
        <button
          onClick={handleCancel}
          title={isEditing ? "Cancel editing" : "Cancel contributing"}
          className="flex items-center gap-2 bg-dbu-bg3 border border-dbu-header text-dbu-text px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RiCloseFill size={18} />
          Cancel
        </button>
      )}
      {isActive && (
        <div className="flex gap-2">
          <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" className={ghostBtn}>
            <RiArrowGoBackLine size={18} />
          </button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" className={ghostBtn}>
            <RiArrowGoForwardLine size={18} />
          </button>
        </div>
      )}
      {canEdit && (
        <button
          onClick={toggleEditMode}
          title={isEditing ? "Exit edit mode" : "Edit page"}
          className={`p-4 rounded-full shadow-lg transition-colors cursor-pointer ${
            isEditing
              ? "bg-dbu-header text-dbu-bg"
              : "bg-dbu-bg3 border border-dbu-header text-dbu-header hover:bg-dbu-header hover:text-dbu-bg"
          }`}
        >
          <RiPencilFill size={20} />
        </button>
      )}
      {canContribute && (
        <button
          onClick={toggleContributeMode}
          title={isContributing ? "Exit contribute mode" : "Add your contribution"}
          className={`p-4 rounded-full shadow-lg transition-colors cursor-pointer ${
            isContributing
              ? "bg-dbu-header text-dbu-bg"
              : "bg-dbu-bg3 border border-dbu-header text-dbu-header hover:bg-dbu-header hover:text-dbu-bg"
          }`}
        >
          <RiAddCircleFill size={20} />
        </button>
      )}
    </div>
  );
}
