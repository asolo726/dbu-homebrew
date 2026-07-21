"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { useState } from "react";
import { RxChevronRight } from "react-icons/rx";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";

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
  const isContributing = ctx?.isContributing ?? false;
  const isCommunity = ctx?.isCommunity ?? false;
  const contributorEmail = ctx?.contributorEmail ?? null;
  const contributorName = ctx?.contributorName ?? null;

  const btnPlusYellow =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-dbu-header/50 text-dbu-header bg-dbu-header/10 hover:bg-dbu-header/20 transition-colors";

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

  function withContributor(base) {
    return isCommunity && contributorEmail
      ? { ...base, contributor: { email: contributorEmail, name: contributorName } }
      : base;
  }

  function handleAddSection() {
    if (!path || !setArrayChange) return;
    const newSection = withContributor({ sectional: { title: "New Section" } });
    if (isMultiTrait) {
      setArrayChange(traitsKey, [...currentTraits, newSection]);
    } else {
      // Convert single-trait to multi-trait, preserving any pending edits
      setArrayChange(traitsKey, [resolveCurrentSingleTrait(), newSection]);
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
          currentTraits.map((trait, i) => {
             if ("sectional" in trait) {
                      const titlePath = path ? `${path}.${i}.sectional.title` : null;
                      return (
                        <div key={i} className="mt-10">
                          <p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
                            {titlePath ? (
                              <EditableText path={titlePath} value={trait.sectional.title} className="text-center" />
                            ) : (
                              trait.sectional.title
                            )}
                          </p>
                          {trait.contributor && (
                            <p className="text-xs text-white italic text-center mt-1 opacity-60">
                              (Added by {trait.contributor.name})
                            </p>
                          )}
                          {isEditing && path && (
                            <div className="flex justify-between items-center mt-2">
                              <button onClick={() => handleRemoveTrait(i)} title="Delete section" className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors"}>
                                <RiSubtractFill size={16} />
                              </button>
                                <button onClick={() => handleAddTraitAfter(i)} title="Add trait below section" className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors"}>
                                  <RiAddFill size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }
            return (
            
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
            </div>);
          })
        ) : (
          <Trait title={title} desc={desc} abilities={abilities} path={path} />
        )}

        {isEditing && path && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddTrait}
              title="Add trait"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RiAddFill size={16} />
              Add Trait
            </button>
            <button onClick={handleAddSection} title="Add section header" className={btnPlusYellow}>
              <RiAddFill size={16} />
              Add Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
