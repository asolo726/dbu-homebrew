"use client";
import Trait from "../General/trait";
import Table from "../General/table";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";

export default function MasteryTrait({ masteryTraitList = [], path }) {
  const hasMultipleMasteryTraits = masteryTraitList.length > 1;
  const ctx = useEditMode();
  const isEditing = ctx?.isEditing ?? false;
  const isContributing = ctx?.isContributing ?? false;
  const isCommunity = ctx?.isCommunity ?? false;
  const contributorEmail = ctx?.contributorEmail ?? null;
  const contributorName = ctx?.contributorName ?? null;
  const pendingChanges = ctx?.pendingChanges ?? {};
  const setArrayChange = ctx?.setArrayChange;
  const isActive = isEditing || isContributing;

  const btnPlus =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors";

  const btnPlusYellow =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-dbu-header/50 text-dbu-header bg-dbu-header/10 hover:bg-dbu-header/20 transition-colors";


  const currentTraits =
    path && path in pendingChanges ? pendingChanges[path] : masteryTraitList;

  function addAt(index, item) {
    if (!path || !setArrayChange) return;
    const arr = [...currentTraits];
    arr.splice(index, 0, item);
    setArrayChange(path, arr);
  }

  function withContributor(base) {
    return isCommunity && contributorEmail
      ? { ...base, contributor: { email: contributorEmail, name: contributorName } }
      : base;
  }

  function newTrait() {
    return withContributor({ title: "New Trait", desc: "Description", abilities: [] });
  }

  function newSection() {
    return withContributor({ sectional: { title: "New Section" } });
  }
  
  function handleAddTraitAfter(index) {
    addAt(index + 1, newTrait());
  }

  function handleAddSection() {
    addAt(currentTraits.length, newSection());
  }

  function handleAddTrait() {
    addAt(currentTraits.length, newTrait());
  }

  return (
    <>
    <div className="mt-10">
      <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        {!hasMultipleMasteryTraits ? "MASTERY TRAIT" : "MASTERY TRAIT(S)"}
      </p>
      {masteryTraitList.map((trait, key) => (
        <div key={key}>
          <Trait
            title={`${trait.title} ${hasMultipleMasteryTraits ? `(${key+1})`: ''}`}
            desc={trait.desc}
            abilities={trait.abilities}
            path={path ? `${path}.${key}` : undefined}
          />
          {trait.tables &&
            trait.tables.map((table, tKey) => (
              <div key={tKey} className="mt-5 mb-5">
                <Table table={table} />
              </div>
            ))}
        </div>
      ))}
    </div>
    {isActive && path && (
      <div className="flex gap-2 mt-4">
        <button onClick={handleAddTrait} title="Add trait" className={btnPlus}>
          <RiAddFill size={16} />
            Add Trait
        </button>
        <button onClick={handleAddSection} title="Add section header" className={btnPlusYellow}>
          <RiAddFill size={16} />
            Add Section
        </button>
      </div>
      )}
    </>
  );
}
