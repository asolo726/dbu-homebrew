"use client";
import TraitsSection from "./TraitsSection";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";
import { EditingButton } from "./util/EditingButton";


type HeaderSize = "h2" | "h3" | "h4";

export interface Section {
    header?: string, // Ex. MASTERY TRAIT
    headerSize?: HeaderSize // Ex. h2
    traits?: any[] // Traits
}

interface SectionProps {
    body: Section[];
    basePath: string;
}

export default function Section({ body, basePath }: Readonly<SectionProps>) {
    const ctx = useEditMode();
    const {isEditing, pendingChanges, isContributing, setChange, isAdmin} = ctx || {};
    const currentBody = basePath && basePath in pendingChanges ? pendingChanges[basePath] : body;
    const isActive = isEditing || isContributing;

    const DEFAULT_HEADER_SIZE: HeaderSize = "h2";
    const headerStyle: Record<HeaderSize, string> = {
        h2: "text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest",
        h3: "text-dbu-header text-center text-lg md:text-xl my-2 font-bold tracking-wider",
        h4: "text-dbu-header text-center text-base md:text-lg my-1 font-semibold",
    };

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

  function handleAddSection() {
    addAt(currentTraits.length, newSection());
  }


    return (
        <>
            {body.map((section, index) => {
                const editable = canEditItem(section);
                return (
                    <div key={index}>
                        {section.header && section.header !== "" && (
                            <div className="mt-10">
                                <p className={headerStyle[section.headerSize ?? DEFAULT_HEADER_SIZE]}>
                                    {section.header}
                                </p>
                            </div>
                        )}
                        {section.traits && (
                            <TraitsSection traits={section.traits as never[]} basePath={"traits"} />
                        )}
                    </div>
                )
            })}
            {isActive && basePath && (
                <div className="flex gap-2 mt-4">
                    <EditingButton
                        variant="add"
                        icon={RiAddFill}
                        title="Add trait"
                        onClick={handleAddTrait}
                    >
                        Add Trait
                    </EditingButton>
                    <EditingButton
                        variant="section"
                        icon={RiAddFill}
                        title="Add section header"
                        onClick={handleAddSection}
                    >
                        Add Section
                    </EditingButton>
                </div>
            )}
        </>
    )
}

/**
 *   function handleAddTraitAfter(index) {
    addAt(index + 1, newTrait());
  }
 */


/**
   * Finds the index of next sectional in currentTraits. If there is no other sectional, it returns the length of the array.
   * @param {number} index
   */
  /**
   * function findNextSectionalIndex(index) {
    const traitsToSearch = currentTraits.slice(index + 1, currentTraits.length);
    let nextSectionalIndex = [];
    traitsToSearch.forEach((item, i) => {
      if ("sectional" in item) {
        nextSectionalIndex.push(i);
      }
    });
    return nextSectionalIndex[0] ?? currentTraits.length;
  }
*/

  /**
   * Sorts all traits below a specific sectional in alphabetical order.
   * NO AI USED
   */
  /**function sortTraitsBelow(index) {
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
*/

/**
 *         if ("sectional" in item) {
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
                  <EditingButton
                    onClick={() => removeAt(index)}
                    title="Delete section"
                    icon={RiSubtractFill}
                    variant="delete"
                  />
                  <EditingButton
                    onClick={() => sortTraitsBelow(index)}
                    title="Alphabetize Traits"
                    variant="sort"
                  >
                    Alphabetize Traits?
                  </EditingButton>
                  <EditingButton
                    onClick={() => handleAddTraitAfter(index)}
                    title="Add trait below section"
                    icon={RiAddFill}
                    variant="add"
                  />
                </div>
              )}
            </div>
          );
        }
 */