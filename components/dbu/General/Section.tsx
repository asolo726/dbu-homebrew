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
}

export default function Section({ body }: Readonly<SectionProps>) {
    const DEFAULT_HEADER_SIZE: HeaderSize = "h2";

    const headerStyle: Record<HeaderSize, string> = {
        h2: "text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest",
        h3: "text-dbu-header text-center text-lg md:text-xl my-2 font-bold tracking-wider",
        h4: "text-dbu-header text-center text-base md:text-lg my-1 font-semibold",
    };

    return (
        <>
            {body.map((section, index) => (
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
            ))}
        </>
    )
}