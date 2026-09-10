"use client";
import TraitsSection from "./SectionTraits";
import {
	RiAddFill,
	RiArrowDownLine,
	RiArrowUpLine,
	RiDeleteBinLine,
} from "react-icons/ri";
import { useEditingState } from "@/components/edit/useEditingState";
import EditableText from "@/components/edit/EditableText";
import { EditingButton } from "./util/EditingButton";
import type { Trait as TraitType } from "./Trait";
import { resolvePendingValue } from "@/components/edit/resolvePendingValue";

type HeaderSize = "h2" | "h3" | "h4";

export interface Section {
	header?: string; // Ex. MASTERY TRAIT
	headerSize?: HeaderSize; // Ex. h2
	traits?: TraitType[]; // Traits
}

interface SectionProps {
	body: Section[];
	basePath: string;
}

export default function Section({ body, basePath }: Readonly<SectionProps>) {
	const {
		isEditing,
		isContributing,
		contributorEmail,
		contributorName,
		isCommunity,
		pendingChanges,
		setArrayChange,
	} = useEditingState();
	const currentBody = resolvePendingValue(
		basePath,
		body,
		pendingChanges ?? {},
	);
	const sections = Array.isArray(currentBody) ? currentBody : [];
	const isActive = isEditing || isContributing;
	const currentlyEditing = isActive && basePath;

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
		return withContributor({
			header: "New Header",
			headerSize: "h2",
			traits: [],
		});
	}

	function addAt(index: number, item: any) {
		if (!basePath || !setArrayChange) return;
		// If adding a new trait, add a new trait within the same section.
		// If adding a new section, add a new section (with header) below where the button is used.
		const arr = [...sections];

		if (item === "trait") {
			const traitsArr = [...(arr[index].traits || [])];
			traitsArr.splice(traitsArr.length, 0, newTrait());
			arr[index] = { ...arr[index], traits: traitsArr };
			setArrayChange(basePath, arr);
		} else {
			arr.splice(index, 0, newSection());
			setArrayChange(basePath, arr);
			console.log(arr);
		}
	}

	function addFirst(item: "trait" | "section") {
		if (!basePath || !setArrayChange) return;
		if (item === "trait") {
			setArrayChange(basePath, [{ header: "", traits: [newTrait()] }]);
			return;
		}
		setArrayChange(basePath, [newSection()]);
	}

	function withContributor(base: any) {
		return isCommunity && contributorEmail
			? {
					...base,
					contributor: {
						email: contributorEmail,
						name: contributorName,
					},
				}
			: base;
	}

	function handleAddTrait(index: number) {
		addAt(index, "trait");
	}

	function handleAddSection(index: number) {
		addAt(index + 1, "section");
	}

	function removeSection(index: number) {
		if (!basePath || !setArrayChange) return;
		setArrayChange(
			basePath,
			sections.filter((_: any, i: number) => i !== index),
		);
	}

	function moveSection(index: number, direction: -1 | 1) {
		if (!basePath || !setArrayChange) return;
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= sections.length) return;

		const reordered = [...sections];
		[reordered[index], reordered[targetIndex]] = [
			reordered[targetIndex],
			reordered[index],
		];
		setArrayChange(basePath, reordered);
	}

	/**
	 * Sorts all traits below a specific sectional in alphabetical order.
	 * NO AI USED
	 */
	function sortTraitsBelow(index: number, traits: TraitType[] | null) {
		if (!basePath || !setArrayChange || !traits) return;
		const sortedTraits = traits.toSorted((a, b) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
		);
		const section = currentBody[index];
		const sectionPath = `${basePath}.${index}`;
		setArrayChange(sectionPath, { ...section, traits: sortedTraits });
	}

	return (
		<>
			{sections.length === 0 && currentlyEditing ? (
				<div className="flex gap-2 mt-4">
					<EditingButton
						variant="add"
						icon={RiAddFill}
						title="Add trait"
						onClick={() => addFirst("trait")}
					>
						Add Trait
					</EditingButton>
					<EditingButton
						variant="section"
						icon={RiAddFill}
						title="Add section header"
						onClick={() => addFirst("section")}
					>
						Add Section
					</EditingButton>
				</div>
			) : null}
			{sections.map((section: Section, index: number) => {
				const hasValidHeader = section.header && section.header !== "";
				const shouldShowHeader = hasValidHeader || currentlyEditing;
				const headerPath = shouldShowHeader
					? basePath
						? `${basePath}.${index}.header`
						: null
					: null;
				const traits = section.traits ?? null;

				return (
					<div key={index}>
						{shouldShowHeader && (
							<div className="mt-10 flex items-center justify-center gap-2">
								{currentlyEditing && (
									<div className="flex items-center gap-1">
										<EditingButton
											icon={RiArrowUpLine}
											title="Move section up"
											variant="sort"
											disabled={index === 0}
											onClick={() =>
												moveSection(index, -1)
											}
										/>
									</div>
								)}
								<p
									className={
										headerStyle[
											section.headerSize ??
												DEFAULT_HEADER_SIZE
										]
									}
								>
									{headerPath ? (
										<EditableText
											path={headerPath}
											value={section.header}
											className="text-center inline-block min-w-4 min-h-6 align-middle"
										/>
									) : (
										section.header
									)}
								</p>
								{currentlyEditing && (
									<EditingButton
										icon={RiArrowDownLine}
										title="Move section down"
										variant="sort"
										disabled={index === sections.length - 1}
										onClick={() => moveSection(index, 1)}
									/>
								)}
							</div>
						)}
						{currentlyEditing && (
							<div className="flex justify-between items-center mt-2">
								<EditingButton
									onClick={() => removeSection(index)}
									title="Delete section"
									icon={RiDeleteBinLine}
									variant="section"
								/>
								<EditingButton
									onClick={() =>
										sortTraitsBelow(index, traits)
									}
									title="Alphabetize Traits"
									variant="sort"
								>
									Alphabetize Traits?
								</EditingButton>
							</div>
						)}
						{traits && (
							<TraitsSection
								traits={traits as TraitType[]}
								basePath={
									basePath
										? `${basePath}.${index}.traits`
										: "traits"
								}
							/>
						)}
						{currentlyEditing && (
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
				);
			})}
		</>
	);
}
