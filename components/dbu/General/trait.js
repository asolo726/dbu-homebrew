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

  const abilitiesKey = path ? `${path}.abilities` : null;
  const currentAbilities =
    abilitiesKey && abilitiesKey in pendingChanges
      ? pendingChanges[abilitiesKey]
      : (abilities ?? []);

  // Merge scalar edits (e.g. individual bullet text changes) into the base array
  // before any structural operation so we don't lose in-progress text edits.
  function resolveCurrentAbilities() {
    const base = abilitiesKey && abilitiesKey in pendingChanges
      ? pendingChanges[abilitiesKey]
      : (abilities ?? []);
    if (!abilitiesKey) return base;
    const prefix = abilitiesKey + ".";
    const scalarKeys = Object.keys(pendingChanges).filter((k) => k.startsWith(prefix));
    if (scalarKeys.length === 0) return base;
    const arr = JSON.parse(JSON.stringify(base));
    for (const key of scalarKeys) {
      const parts = key.slice(prefix.length).split(".");
      let obj = arr;
      let valid = true;
      for (let j = 0; j < parts.length - 1; j++) {
        const seg = parts[j];
        const next = obj[isNaN(seg) ? seg : Number(seg)];
        if (next == null) { valid = false; break; }
        obj = next;
      }
      if (valid) {
        const last = parts[parts.length - 1];
        obj[isNaN(last) ? last : Number(last)] = pendingChanges[key];
      }
    }
    return arr;
  }

  function toggleSelect(index) {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  function handleAdd(newAbility) {
    if (!path || !setArrayChange) return;
    setArrayChange(abilitiesKey, [...resolveCurrentAbilities(), newAbility]);
    setShowAddModal(false);
  }

  function handleRemove() {
    if (!path || !setArrayChange || selectedIndices.size === 0) return;
    const filtered = resolveCurrentAbilities().filter((_, i) => !selectedIndices.has(i));
    setArrayChange(abilitiesKey, filtered);
    setSelectedIndices(new Set());
  }

  function handleMove(index, direction) {
    if (!path || !setArrayChange) return;
    const resolved = resolveCurrentAbilities();
    const target = index + direction;
    if (target < 0 || target >= resolved.length) return;
    const arr = [...resolved];
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setArrayChange(abilitiesKey, arr);
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

  function handleUpdateAbility(abilityIndex, op) {
    if (!path || !setArrayChange) return;
    const arr = resolveCurrentAbilities().map((item, i) => {
      if (i !== abilityIndex) return item;
      if (op.type === "list:add") {
        return { ...item, list: [...(item.list ?? []), ""] };
      }
      if (op.type === "list:remove") {
        return { ...item, list: item.list.filter((_, j) => j !== op.index) };
      }
      if (op.type === "miniTraitList:add") {
        return { ...item, miniTraitList: [...(item.miniTraitList ?? []), { title: "", desc: "" }] };
      }
      if (op.type === "miniTraitList:remove") {
        return { ...item, miniTraitList: item.miniTraitList.filter((_, j) => j !== op.index) };
      }
      return item;
    });
    setArrayChange(abilitiesKey, arr);
  }

  return (
    <div className="flex-grow-1 mt-4">
      {(title !== "" || desc !== "") && (
        <p className="text-dbu-text text-md md:text-lg text-left">
          {title !== "" && (
            <span className="font-bold text-dbu-header">
              {path ? <EditableText path={`${path}.title`} value={title} /> : title}:{" "}
            </span>
          )}
          {path ? <EditableText path={`${path}.desc`} value={desc} /> : desc}
        </p>
      )}

      <Ability
        abilityList={currentAbilities}
        path={path}
        selectedIndices={disableEditActions ? undefined : selectedIndices}
        onToggleSelect={disableEditActions ? undefined : toggleSelect}
        onMove={disableEditActions ? undefined : handleMove}
        onUpdateAbility={disableEditActions ? undefined : handleUpdateAbility}
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
