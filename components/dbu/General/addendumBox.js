"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { useState } from "react";
import { RxChevronRight } from "react-icons/rx";
import { RiAddFill, RiDeleteBinLine } from "react-icons/ri";

export default function AddendumBox({
  boxTitle,
  title = "",
  desc = "",
  abilities,
  traits,
  path,
}) {
  const ctx = useEditMode() || {};
  const { isEditing, pendingChanges = {}, setArrayChange } = ctx;
  const [menuState, setMenuState] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Resolve current traits array from pendingChanges, falling back to prop
  const traitsKey = path ? `${path}.traits` : null;
  const currentTraits =
    traitsKey && traitsKey in pendingChanges
      ? pendingChanges[traitsKey]
      : traits;

  const isMultiTrait = currentTraits != null;

  // Read current single-trait values (merging any scalar edits) for conversion
  function resolveCurrentSingleTrait() {
    return {
      title: path && `${path}.title` in pendingChanges ? pendingChanges[`${path}.title`] : title,
      desc: path && `${path}.desc` in pendingChanges ? pendingChanges[`${path}.desc`] : desc,
      abilities: path && `${path}.abilities` in pendingChanges ? pendingChanges[`${path}.abilities`] : (abilities ?? []),
    };
  }

  function handleAddTrait() {
    if (!path || !setArrayChange) return;
    const newTrait = { title: "", desc: "", abilities: [] };
    if (isMultiTrait) {
      setArrayChange(traitsKey, [...currentTraits, newTrait]);
    } else {
      // Convert single-trait to multi-trait, preserving any pending edits
      setArrayChange(traitsKey, [resolveCurrentSingleTrait(), newTrait]);
    }
  }

  function handleRemoveTrait(i) {
    if (!path || !setArrayChange || !currentTraits) return;
    setArrayChange(traitsKey, currentTraits.filter((_, j) => j !== i));
  }

  const chevron = (
    <RxChevronRight
      className={"stroke-1 shrink-0 transition-transform ".concat(
        menuState
          ? isHovering ? "rotate-45" : "rotate-90"
          : isHovering ? "rotate-45" : "rotate-0",
      )}
    />
  );

  return (
    <div className="border border-dbu-header">
      {isEditing ? (
        <div
          className="flex items-center gap-2 w-full px-3 py-3"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button onClick={() => setMenuState(!menuState)} className="cursor-pointer shrink-0">
            {chevron}
          </button>
          <p className="text-md md:text-lg flex-1">
            <EditableText path={path ? `${path}.boxTitle` : undefined} value={boxTitle} />
          </p>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 w-full text-left px-3 py-3 cursor-pointer font-sans"
          onClick={() => setMenuState(!menuState)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {chevron}
          <p className="text-md md:text-lg">{boxTitle}</p>
        </button>
      )}

      <div className={menuState ? "block px-3 pb-3" : "hidden"}>
        {isMultiTrait ? (
          currentTraits.map((trait, i) => (
            <div key={i}>
              <Trait
                title={trait.title}
                desc={trait.desc}
                abilities={trait.abilities}
                path={path ? `${path}.traits.${i}` : undefined}
              />
              {isEditing && path && (
                <div className="flex justify-start mt-1 mb-2">
                  <button
                    onClick={() => handleRemoveTrait(i)}
                    title="Delete trait"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors"
                  >
                    <RiDeleteBinLine size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <Trait title={title} desc={desc} abilities={abilities} path={path} />
        )}

        {isEditing && path && (
          <div className="mt-3">
            <button
              onClick={handleAddTrait}
              title="Add trait"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RiAddFill size={16} />
              Add Trait
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
