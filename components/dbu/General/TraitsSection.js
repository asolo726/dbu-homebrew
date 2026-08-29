"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";
import { btnMinus, btnPlus, btnSort } from "./util/EditingButton";

export default function TraitsSection({ traits = [], basePath }) {
  const ctx = useEditMode();
  const isEditing = ctx?.isEditing ?? false;
  const isContributing = ctx?.isContributing ?? false;
  const isCommunity = ctx?.isCommunity ?? false;
  const contributorEmail = ctx?.contributorEmail ?? null;
  const contributorName = ctx?.contributorName ?? null;
  const pendingChanges = ctx?.pendingChanges ?? {};
  const setArrayChange = ctx?.setArrayChange;

  const isActive = isEditing || isContributing;

  const currentTraits =
    basePath && basePath in pendingChanges ? pendingChanges[basePath] : traits;

  // In contribute mode, users can only edit items they contributed themselves
  function canEditItem(item) {
    if (isEditing) return true;
    if (isContributing) return item.contributor?.email === contributorEmail;
    return false;
  }

  function addAt(index, item) {
    if (!basePath || !setArrayChange) return;
    const arr = [...currentTraits];
    arr.splice(index, 0, item);
    setArrayChange(basePath, arr);
  }

  function removeAt(index) {
    if (!basePath || !setArrayChange) return;
    setArrayChange(
      basePath,
      currentTraits.filter((_, i) => i !== index),
    );
  }

  function withContributor(base) {
    return isCommunity && contributorEmail
      ? {
          ...base,
          contributor: { email: contributorEmail, name: contributorName },
        }
      : base;
  }

  function newTrait() {
    return withContributor({
      title: "New Trait",
      desc: "Description",
      abilities: [],
    });
  }

  function newSection() {
    return withContributor({ sectional: { title: "New Section" } });
  }

  function handleAddTrait() {
    addAt(currentTraits.length, newTrait());
  }

  function handleAddTraitAfter(index) {
    addAt(index + 1, newTrait());
  }

  function handleAddSection() {
    addAt(currentTraits.length, newSection());
  }

  /**
   * Finds the index of next sectional in currentTraits. If there is no other sectional, it returns the length of the array.
   * @param {number} index
   */
  function findNextSectionalIndex(index) {
    const traitsToSearch = currentTraits.slice(index + 1, currentTraits.length);
    let nextSectionalIndex = [];
    traitsToSearch.forEach((item, i) => {
      if ("sectional" in item) {
        nextSectionalIndex.push(i);
      }
    });
    return nextSectionalIndex[0] ?? currentTraits.length;
  }

  /**
   * Sorts all traits below a specific sectional in alphabetical order.
   * NO AI USED
   */
  function sortTraitsBelow(index) {
    const startingIndex = 1 + index; // Excludes the sectional.
    const currentTraitsCopy = [...currentTraits];
    const traitsToSort = currentTraitsCopy.slice(
      startingIndex,
      startingIndex + findNextSectionalIndex(index),
    );
    const numberOfSortedTraits = traitsToSort.length;
    traitsToSort.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
    for (let i = 0; i !== numberOfSortedTraits; i++) {
      currentTraitsCopy[startingIndex + i] = traitsToSort[i];
      console.log(`traitsToSort [${i}]`, traitsToSort[i]);
    }
    setArrayChange(basePath, currentTraitsCopy);
  }

  return (
    <>
      {currentTraits.map((item, index) => {
        const editable = canEditItem(item);

        if ("sectional" in item) {
          const titlePath =
            basePath && editable
              ? `${basePath}.${index}.sectional.title`
              : null;
          return (
            <div key={index} className="mt-10">
              <p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
                {titlePath ? (
                  <EditableText
                    path={titlePath}
                    value={item.sectional.title}
                    className="text-center"
                  />
                ) : (
                  item.sectional.title
                )}
              </p>
              {item.contributor && (
                <p className="text-xs text-white italic text-center mt-1 opacity-60">
                  (Added by {item.contributor.name})
                </p>
              )}
              {isActive && basePath && (
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    title="Delete section"
                    className={btnMinus}
                  >
                    <RiSubtractFill size={16} /> Delete Section
                  </button>
                  <button
                    type="button"
                    onClick={() => sortTraitsBelow(index)}
                    title="alphabetize traits"
                    className={btnSort}
                  >
                    Alphabetize Traits?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTraitAfter(index)}
                    title="Add trait below section"
                    className={btnPlus}
                  >
                    <RiAddFill size={16} /> Add Trait
                  </button>
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={index}>
            <Trait
              title={item.title}
              desc={item.desc}
              abilities={item.abilities}
              contributor={item.contributor ?? null}
              disableEditActions={!editable}
              path={basePath && editable ? `${basePath}.${index}` : undefined}
            />
            {isActive && basePath && editable && (
              <div className="flex justify-start mt-1 mb-2">
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  title="Delete trait"
                  className={btnMinus}
                >
                  <RiDeleteBinLine size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {isActive && basePath && (
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleAddTrait}
            title="Add trait"
            className={btnPlus}
          >
            <RiAddFill size={16} />
            Add Trait
          </button>
          <button
            type="button"
            onClick={handleAddSection}
            title="Add section header"
            className={btnPlusYellow}
          >
            <RiAddFill size={16} />
            Add Section
          </button>
        </div>
      )}
    </>
  );
}
