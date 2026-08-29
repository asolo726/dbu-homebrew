import EditableText from "@/components/edit/EditableText";
import {
  getAspectTooltip,
  prettifyAspects,
} from "@/components/dbu/general/util/headUtil";
import { useState, useEffect } from "react";
import AspectsModal from "@/components/edit/AspectModal";
export interface Aspect {
  name: string;
  level: number;
  maxLevel?: number;
  link?: { name: string; url: string };
}
interface AspectsProps {
  aspects: Aspect[];
  customAspectNames: string[];
  spanStyle: string;
  aspectsReady: boolean;
  isEditing: boolean;
  pendingChanges: {};
  handleAspectChange: (value: {}) => void
}

export default function Aspects({
  aspects,
  customAspectNames,
  spanStyle,
  aspectsReady,
  isEditing,
  pendingChanges,
  handleAspectChange
}: Readonly<AspectsProps>) {
  const btnStyle =
    "ml-2 gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors";
  const [aspectWindowOpen, setAspectWindowOpen] = useState(false);

  const onSave = (newAspects: any) => {
    handleAspectChange(newAspects);
    setAspectWindowOpen(false);
  };

  const toggleAspectWindowState = () => {
    setAspectWindowOpen(!aspectWindowOpen);
  };
  const [sortedAspects, setSortedAspects] = useState<Aspect[]>([]);

  useEffect(() => {
    if (aspects) {
        setSortedAspects(prettifyAspects(aspects))
    }
    }, [aspects]);

  if (sortedAspects) {
    // Normal Render
    if (!isEditing) {
      return (
        <li>
          <p>
            <span className={spanStyle}>Aspects: </span>{" "}
            {sortedAspects.map((aspect, id) => {
              const lastAspect = id === sortedAspects.length - 1;
              const tooltipHtml = aspectsReady
                ? getAspectTooltip(aspect.name)
                : "";
              return (
                <span key={id}>
                  <span
                    data-tooltip-id="my-tooltip"
                    data-tooltip-html={tooltipHtml}
                    className="cursor-help"
                  >
                    <span
                      className={`${customAspectNames.includes(aspect.name) ? "underline" : ""}`}
                    >
                      {aspect.name}
                    </span>
                  </span>
                  {aspect.link && (
                    <>
                      {" "}
                      (
                      <a
                        href={aspect.link.url}
                        target="_blank"
                        className="text-dbu-link hover:underline"
                      >
                        {aspect.link.name}
                      </a>
                      )
                    </>
                  )}
                  {aspect.level !== 0 && <> (LV{aspect.level})</>}
                  {!lastAspect && ", "}
                </span>
              );
            })}
          </p>
        </li>
      );
    }

    // Editing Render
    return (
      <>
        <li>
          <p>
            <span className={spanStyle}>Aspects: </span>{" "}
            <button
              type="button"
              className={btnStyle}
              onClick={toggleAspectWindowState}
            >
              <span>Edit</span>
            </button>
          </p>
        </li>
        {aspectWindowOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <AspectsModal
              currentAspects={sortedAspects}
              onSave={onSave}
              onClose={() => setAspectWindowOpen(false)}
            />
          </div>
        )}
      </>
    );
  }
}
