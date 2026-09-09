"use client";
import Trait from "./Trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { useState, useEffect } from "react";
import { RxChevronRight } from "react-icons/rx";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";
import { EditingButton } from "./util/EditingButton";
import type { Section as SectionType } from "./Section";
import Section from "./Section";
import { useEditingState } from "@/components/edit/useEditingState";

export interface DBUBoxProps {
	boxTitle?: string;
	body?: SectionType[];
	path?: string;
}

export default function AddendumBox({
	boxTitle,
	body,
	path,
}: Readonly<DBUBoxProps>) {
	const {
		isEditing,
		isContributing,
		pendingChanges = {},
	} = useEditingState();
	const [menuState, setMenuState] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	// There are special kinds of boxes that should always be open. Such
	// as Signature Techniques, Unique Abilities, etc. A way we can account
	// for this is to check if there's a boxTitle or not.
	const isOpenBox = boxTitle === "";

	// Resolve current traits array from pendingChanges, falling back to prop
	const traitsKey = path ? `${path}.body` : "";
	const currentBody =
		traitsKey && traitsKey in pendingChanges
			? pendingChanges[traitsKey]
			: body;

	const chevron = (
		<RxChevronRight
			className={"stroke-1 shrink-0 transition-transform ".concat(
				menuState
					? isHovering
						? "rotate-45"
						: "rotate-90"
					: isHovering
						? "rotate-45"
						: "rotate-0",
			)}
		/>
	);

	// When a user starts editing, it's convienient to open all the boxes.
	// OpenBoxes should also always be open.
	useEffect(() => {
		if (isEditing || isOpenBox) {
			setMenuState(true);
		}
	}, [isEditing]);

	return (
		<div className="border border-dbu-header">
			{isEditing || isContributing ? (
				<div
					className="flex items-center gap-2 w-full px-3 py-3"
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
				>
					<button
						onClick={() => setMenuState(!menuState)}
						className="cursor-pointer shrink-0"
					>
						{chevron}
					</button>
					<p className="text-md md:text-lg flex-1">
						<EditableText
							path={path ? `${path}.boxTitle` : undefined}
							value={boxTitle}
						/>
					</p>
				</div>
			) : isOpenBox ? (
				<button className="flex items-center gap-2 w-full text-left px-3 py-3 font-sans" />
			) : (
				<button
					className="flex items-center gap-2 w-full text-left px-3 py-3 cursor-pointer font-sans"
					onClick={() => setMenuState(!menuState)}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
				>
					{chevron}
					<p className="text-md md:text-lg">{boxTitle}</p>
				</button>
			)}

			<div className={menuState ? "block px-3 pb-3" : "hidden"}>
				<Section
					body={Array.isArray(currentBody) ? currentBody : []}
					basePath={`${traitsKey}`}
				/>
			</div>
		</div>
	);
}
