"use client";
import { useState, useEffect } from "react";
import Ability from "./ability";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import AddAbilityModal from "../../edit/AddAbilityModal";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";

export default function Trait({ title = "", desc = "", abilities, path, disableEditActions = false }) {
  const ctx = useEditMode();
  const isEditing = ctx?.isEditing ?? false;
  const pendingChanges = ctx?.pendingChanges ?? {};
  const setChange = ctx?.setChange;
  const setArrayChange = ctx?.setArrayChange;

  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  // Reset selection when edit mode exits
  useEffect(() => {
    if (!isEditing) {
      setSelectedIndices(new Set());
      setShowAddModal(false);
    }
  }, [isEditing]);

  // Resolve current abilities: use the stored full array from pendingChanges if
  // setArrayChange was called, otherwise fall back to the prop from the DB.
  const abilitiesKey = path ? `${path}.abilities` : null;
  const currentAbilities =
    abilitiesKey && abilitiesKey in pendingChanges
      ? pendingChanges[abilitiesKey]
      : (abilities ?? []);

  function toggleSelect(index) {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  function handleAdd(newAbility) {
    if (!path || !setArrayChange) return;
    setArrayChange(abilitiesKey, [...currentAbilities, newAbility]);
    setShowAddModal(false);
  }

  function handleRemove() {
    if (!path || !setArrayChange || selectedIndices.size === 0) return;
    const filtered = currentAbilities.filter((_, i) => !selectedIndices.has(i));
    setArrayChange(abilitiesKey, filtered);
    setSelectedIndices(new Set());
  }

  function handleMove(index, direction) {
    if (!path || !setArrayChange) return;
    const target = index + direction;
    if (target < 0 || target >= currentAbilities.length) return;
    const arr = [...currentAbilities];
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setArrayChange(abilitiesKey, arr);
    // Keep selection tracking consistent after move
    setSelectedIndices((prev) => {
      const next = new Set();
      for (const i of prev) {
        if (i === index) next.add(target);
        else if (i === target) next.add(index);
        else next.add(i);
      }
      return next;
    });
  }

  return (
    <div className="flex-grow-1 mt-4">
      {title !== "" && desc !== "" ? (
        <p className="text-dbu-text text-md md:text-lg text-left">
          <span className="font-bold text-dbu-header">
            {path ? <EditableText path={`${path}.title`} value={title} /> : title}:
          </span>{" "}
          {path ? <EditableText path={`${path}.desc`} value={desc} /> : desc}
        </p>
      ) : (
        ""
      )}

      <Ability
        abilityList={currentAbilities}
        path={path}
        selectedIndices={disableEditActions ? undefined : selectedIndices}
        onToggleSelect={disableEditActions ? undefined : toggleSelect}
        onMove={disableEditActions ? undefined : handleMove}
      />

      {/* Add / Remove buttons — only in edit mode, only when a path exists, and not inside AddendumBox */}
      {isEditing && path && !disableEditActions && (
        <div className="flex justify-between items-center mt-3">
          {/* Remove selected — bottom left, red */}
          <button
            onClick={handleRemove}
            disabled={selectedIndices.size === 0}
            title="Remove selected abilities"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-900/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <RiSubtractFill size={16} />
            {selectedIndices.size > 0 && (
              <span className="text-xs">{selectedIndices.size}</span>
            )}
          </button>

          {/* Add ability — bottom right, white */}
          <button
            onClick={() => setShowAddModal(true)}
            title="Add ability"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RiAddFill size={16} />
          </button>
        </div>
      )}

      {!disableEditActions && showAddModal && (
        <AddAbilityModal onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
