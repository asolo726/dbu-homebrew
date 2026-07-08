"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiDeleteBinLine } from "react-icons/ri";

export default function TraitsSection({ traits = [], basePath }) {
  const ctx = useEditMode();
  const isEditing = ctx?.isEditing ?? false;
  const pendingChanges = ctx?.pendingChanges ?? {};
  const setArrayChange = ctx?.setArrayChange;

  const currentTraits =
    basePath && basePath in pendingChanges ? pendingChanges[basePath] : traits;

  function handleAddSection() {
    if (!basePath || !setArrayChange) return;
    setArrayChange(basePath, [...currentTraits, { sectional: { title: "New Section" } }]);
  }

  function handleDeleteSection(index) {
    if (!basePath || !setArrayChange) return;
    setArrayChange(basePath, currentTraits.filter((_, i) => i !== index));
  }

  return (
    <>
      {currentTraits.map((item, index) => {
        if ("sectional" in item) {
          const titlePath = basePath ? `${basePath}.${index}.sectional.title` : null;
          return (
            <div key={index} className="mt-10 relative group">
              <p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
                {titlePath ? (
                  <EditableText path={titlePath} value={item.sectional.title} className="text-center" />
                ) : (
                  item.sectional.title
                )}
              </p>
              {isEditing && basePath && (
                <button
                  onClick={() => handleDeleteSection(index)}
                  title="Delete section"
                  className="absolute top-1/2 -translate-y-1/2 right-0 p-1.5 rounded text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-900/30 transition-all"
                >
                  <RiDeleteBinLine size={16} />
                </button>
              )}
            </div>
          );
        }
        return (
          <Trait
            key={index}
            title={item.title}
            desc={item.desc}
            abilities={item.abilities}
            path={basePath ? `${basePath}.${index}` : undefined}
          />
        );
      })}
      {isEditing && basePath && (
        <button
          onClick={handleAddSection}
          title="Add section header"
          className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-dbu-header/50 text-dbu-header bg-dbu-header/10 hover:bg-dbu-header/20 transition-colors"
        >
          <RiAddFill size={16} />
          Add Section
        </button>
      )}
    </>
  );
}
