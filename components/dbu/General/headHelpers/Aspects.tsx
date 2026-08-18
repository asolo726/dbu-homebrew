import EditableText from "@/components/edit/EditableText";
import { getAspectTooltip } from "@/components/dbu/General/util/headUtil";
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
}

export default function Aspects({
    aspects,
    customAspectNames,
    spanStyle,
    aspectsReady,
}: Readonly<AspectsProps>) {
    if (aspects && aspects.length > 0) {
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
                                <a
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-html={tooltipHtml}
                                    className="cursor-help"
                                >
                                    <span
                                        className={`${customAspectNames.includes(aspect.name) ? "underline" : ""}`}
                                    >
                                        {aspect.name}
                                    </span>
                                </a>
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
}