"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";

const btnMinus =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors";
const btnPlus =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors";
const btnPlusYellow =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-dbu-header/50 text-dbu-header bg-dbu-header/10 hover:bg-dbu-header/20 transition-colors";

export default function TraitsSection({ traits = [], basePath }) {
  const ctx = useEditMode();
  const isEditing = ctx?.isEditing ?? false;
  const pendingChanges = ctx?.pendingChanges ?? {};
  const setArrayChange = ctx?.setArrayChange;

  const currentTraits =
    basePath && basePath in pendingChanges ? pendingChanges[basePath] : traits;

  function addAt(index, item) {
    if (!basePath || !setArrayChange) return;
    const arr = [...currentTraits];
    arr.splice(index, 0, item);
    setArrayChange(basePath, arr);
  }

  function removeAt(index) {
    if (!basePath || !setArrayChange) return;
    setArrayChange(basePath, currentTraits.filter((_, i) => i !== index));
  }

  function handleAddTrait() {
    addAt(currentTraits.length, { title: "New Trait", desc: "Description", abilities: [] });
  }

  function handleAddTraitAfter(index) {
    addAt(index + 1, { title: "New Trait", desc: "Description", abilities: [] });
  }

  function handleAddSection() {
    addAt(currentTraits.length, { sectional: { title: "New Section" } });
  }

  return (
    <>
      {currentTraits.map((item, index) => {
        if ("sectional" in item) {
          const titlePath = basePath ? `${basePath}.${index}.sectional.title` : null;
          return (
            <div key={index} className="mt-10">
              <p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
                {titlePath ? (
                  <EditableText path={titlePath} value={item.sectional.title} className="text-center" />
                ) : (
                  item.sectional.title
                )}
              </p>
              {isEditing && basePath && (
                <div className="flex justify-between items-center mt-2">
                  <button onClick={() => removeAt(index)} title="Delete section" className={btnMinus}>
                    <RiSubtractFill size={16} />
                  </button>
                  <button onClick={() => handleAddTraitAfter(index)} title="Add trait below section" className={btnPlus}>
                    <RiAddFill size={16} />
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
              path={basePath ? `${basePath}.${index}` : undefined}
            />
            {isEditing && basePath && (
              <div className="flex justify-start mt-1 mb-2">
                <button onClick={() => removeAt(index)} title="Delete trait" className={btnMinus}>
                  <RiDeleteBinLine size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {isEditing && basePath && (
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
