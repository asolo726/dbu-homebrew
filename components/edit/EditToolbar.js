"use client";
import { useEditMode } from "./EditModeContext";
import { useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import { RiSaveFill } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";

export default function EditToolbar() {
  const { isEditing, setIsEditing, hasChanges, pendingChanges, clearChanges, keyName } = useEditMode();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error" | null

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
    setSaveStatus(null);
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
      {saveStatus === "error" && (
        <p className="text-red-400 text-sm bg-dbu-bg3 px-3 py-1 rounded">Failed to save.</p>
      )}
      {saveStatus === "success" && (
        <p className="text-green-400 text-sm bg-dbu-bg3 px-3 py-1 rounded">Saved!</p>
      )}
      {isEditing && hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          title="Save changes"
          className="flex items-center gap-2 bg-dbu-header text-dbu-bg px-4 py-2 rounded-full font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <RiSaveFill size={18} />
          {saving ? "Saving..." : "Save"}
        </button>
      )}
      {isEditing && (
        <button
          onClick={handleCancel}
          title="Cancel editing"
          className="flex items-center gap-2 bg-dbu-bg3 border border-dbu-header text-dbu-text px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <RiCloseFill size={18} />
          Cancel
        </button>
      )}
      <button
        onClick={() => { setIsEditing(!isEditing); setSaveStatus(null); }}
        title={isEditing ? "Exit edit mode" : "Edit page"}
        className={`p-4 rounded-full shadow-lg transition-colors ${
          isEditing
            ? "bg-dbu-header text-dbu-bg"
            : "bg-dbu-bg3 border border-dbu-header text-dbu-header hover:bg-dbu-header hover:text-dbu-bg"
        }`}
      >
        <RiPencilFill size={20} />
      </button>
    </div>
  );
}
