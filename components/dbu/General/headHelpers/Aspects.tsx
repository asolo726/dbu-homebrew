import EditableText from "@/components/edit/EditableText";
import { getAspectTooltip } from "@/components/dbu/General/util/headUtil";
import { useState } from "react";
interface AspectList {
    name: string;
    level: number;
    link?: { name: string; url: string };
}
interface AspectsProps {
    aspects: AspectList[];
    customAspectNames: string[];
    spanStyle: string;
    aspectsReady: boolean;
    isEditing: boolean;
}

export default function Aspects({
    aspects,
    customAspectNames,
    spanStyle,
    aspectsReady,
    isEditing,
}: Readonly<AspectsProps>) {
    const btnStyle  = "ml-2 gap-1.5 px-3 py-1.5 rounded-md text-sm border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors";
    const [aspectWindowOpen, setAspectWindowOpen] = useState(false);

    const toggleAspectWindowState = () => {
        setAspectWindowOpen(!aspectWindowOpen);
    };

    if (aspects && aspects.length > 0) {
        // Normal Render
        if (!isEditing) {
            return (
                <li>
                    <p>
                        <span className={spanStyle}>Aspects: </span>{" "}
                        {aspects.map((aspect, id) => {
                            const lastAspect = id === aspects.length - 1;
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
                                    {aspect.level !== 0 && (
                                        <> (LV{aspect.level})</>
                                    )}
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
            <li>
                <p>
                    <span className={spanStyle}>Aspects: </span>{" "}
                    <button type="button" className={btnStyle} onClick={toggleAspectWindowState}>
                        <span> 
                            Edit
                        </span>
                    </button>
                </p>
            </li>
        );
    }
}
