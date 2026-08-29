"use client";
import TraitsSection from "./TraitsSection";
import { RiAddFill } from "react-icons/ri";
import { useEditingState } from "@/components/edit/useEditingState";
import EditableText from "@/components/edit/EditableText";
import { EditingButton } from "./util/EditingButton";


type HeaderSize = "h2" | "h3" | "h4";

export interface Trait {
    title: string,
    desc: string,
    abilities: any[]
}

export interface Section {
    header?: string, // Ex. MASTERY TRAIT
    headerSize?: HeaderSize // Ex. h2
    traits?: Trait[] // Traits
}

interface SectionProps {
    body: Section[];
    basePath: string;
}

export default function Section({ body, basePath }: Readonly<SectionProps>) {
    const { isEditing, isContributing, contributorEmail, contributorName, isCommunity, pendingChanges, setArrayChange } = useEditingState();
    const currentBody = basePath && pendingChanges && basePath in pendingChanges ? pendingChanges[basePath] : body;
    const isActive = isEditing || isContributing;

    const DEFAULT_HEADER_SIZE: HeaderSize = "h2";
    const headerStyle: Record<HeaderSize, string> = {
        h2: "text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest",
        h3: "text-dbu-header text-center text-lg md:text-xl my-2 font-bold tracking-wider",
        h4: "text-dbu-header text-center text-base md:text-lg my-1 font-semibold",
    };

    function canEditItem(item: any) {
    if (isEditing) return true;
    if (isContributing) return item.contributor?.email === contributorEmail;
    return false;
}

  function newTrait() {
    return withContributor({
      title: "New Trait",
      desc: "Description",
      abilities: [],
    });
  }

  function newSection() {
    return ({ header: "New Header", headerSize: "h2", traits: [] })
  }

  function addAt(index: number, item: any) {
    if (!basePath || !setArrayChange) return;
    // If adding a new trait, add a new trait within the same section.
    // If adding a new section, add a new section (with header) below where the button is used.
    console.log(index);
    if (item === "trait") {
        const section = currentBody[index];
        const sectionPath = `${basePath}.${index}`;
        const traitsArr = [...(section.traits || [])];
        // Add the new trait below all other traits.
        traitsArr.splice(traitsArr.length, 0, newTrait());
        setArrayChange(sectionPath, {...section, traits: traitsArr});
    } else {
        const arr = [...currentBody];
        arr.splice(index, 0, newSection());
        setArrayChange(basePath, arr);
        console.log(arr);
    }
  }

  function withContributor(base: any) {
    return isCommunity && contributorEmail
      ? {
          ...base,
          contributor: { email: contributorEmail, name: contributorName },
        }
      : base;
  }

  function handleAddTrait(index: number) {
    addAt(index, "trait");
  }

  function handleAddSection(index: number) {
    addAt(index+1, "section");
  }

  /**
   * Sorts all traits below a specific sectional in alphabetical order.
   * NO AI USED
   */
  function sortTraitsBelow(index: number, traits: Trait[]) {
    if (!basePath || !setArrayChange) return;
    const sortedTraits = traits.toSorted((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
    const section = currentBody[index];
    const sectionPath = `${basePath}.${index}`;
    setArrayChange(sectionPath, {...section, traits: sortedTraits});
  }


    return (
        <>
            {body.map((section, index) => {
                const hasValidHeader = section.header && section.header !== "";
                const headerPath = hasValidHeader ? basePath ? `${basePath}.${index}.header` : null : null;
                const traits = section.traits ?? null;

                return (
                <div key={index}>
                    {hasValidHeader && (
                        <div className="mt-10">
                            <p className={headerStyle[section.headerSize ?? DEFAULT_HEADER_SIZE]}>
                                {headerPath ? (
                                    <EditableText 
                                        path={headerPath}
                                        value={section.header}
                                        className="text-center"
                                    />
                                ) : (
                                    section.header
                                )}
                            </p>
                        </div>
                    )}
                    {isActive && basePath && (
                        <div className="flex justify-between items-center mt-2">
                            <EditingButton
                                onClick={() => sortTraitsBelow(index, traits)}
                                title="Alphabetize Traits"
                                variant="sort"
                            >
                                Alphabetize Traits?
                            </EditingButton>
                        </div>
                    )}
                    {traits && (
                        <TraitsSection traits={traits as never[]} basePath={"traits"} />
                    )}
                    {isActive && basePath && (
                        <div className="flex gap-2 mt-4">
                            <EditingButton
                                variant="add"
                                icon={RiAddFill}
                                title="Add trait"
                                onClick={() => handleAddTrait(index)}
                            >
                                Add Trait
                            </EditingButton>
                            <EditingButton
                                variant="section"
                                icon={RiAddFill}
                                title="Add section header"
                                onClick={() => handleAddSection(index)}
                            >
                                Add Section
                            </EditingButton>
                        </div>
                    )}
                </div>
            )})}
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