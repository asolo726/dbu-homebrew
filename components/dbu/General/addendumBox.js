"use client";
import Trait from "./Trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { useState, useEffect } from "react";
import { RxChevronRight } from "react-icons/rx";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";
import { EditingButton } from "./util/EditingButton";

export default function AddendumBox({
	boxTitle,
	title = "",
	desc = "",
	abilities,
	traits,
	path,
}) {
	const ctx = useEditMode() || {};
	const { isEditing, pendingChanges = {}, setArrayChange } = ctx;
	const [menuState, setMenuState] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const isContributing = ctx?.isContributing ?? false;
	const isCommunity = ctx?.isCommunity ?? false;
	const contributorEmail = ctx?.contributorEmail ?? null;
	const contributorName = ctx?.contributorName ?? null;

	// Resolve current traits array from pendingChanges, falling back to prop
	const traitsKey = path ? `${path}.traits` : null;
	const currentTraits =
		traitsKey && traitsKey in pendingChanges
			? pendingChanges[traitsKey]
			: traits;

	const isMultiTrait = currentTraits != null;

	// There are special kinds of boxes that should always be open. Such
	// as Signature Techniques, Unique Abilities, etc. A way we can account
	// for this is to check if there's a boxTitle or not.
	const isOpenBox = boxTitle === "";

	// Read current single-trait values (merging any scalar edits) for conversion
	function resolveCurrentSingleTrait() {
		return {
			title:
				path && `${path}.title` in pendingChanges
					? pendingChanges[`${path}.title`]
					: title,
			desc:
				path && `${path}.desc` in pendingChanges
					? pendingChanges[`${path}.desc`]
					: desc,
			abilities:
				path && `${path}.abilities` in pendingChanges
					? pendingChanges[`${path}.abilities`]
					: (abilities ?? []),
		};
	}

	function handleAddTrait() {
		if (!path || !setArrayChange) return;
		const newTrait = { title: "", desc: "", abilities: [] };
		if (isMultiTrait) {
			setArrayChange(traitsKey, [...currentTraits, newTrait]);
		} else {
			// Convert single-trait to multi-trait, preserving any pending edits
			setArrayChange(traitsKey, [resolveCurrentSingleTrait(), newTrait]);
		}
	}

	function withContributor(base) {
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

	function handleAddSection() {
		if (!path || !setArrayChange) return;
		const newSection = withContributor({
			sectional: { title: "New Section" },
		});
		if (isMultiTrait) {
			setArrayChange(traitsKey, [...currentTraits, newSection]);
		} else {
			// Convert single-trait to multi-trait, preserving any pending edits
			setArrayChange(traitsKey, [
				resolveCurrentSingleTrait(),
				newSection,
			]);
		}
	}

	function handleRemoveTrait(i) {
		if (!path || !setArrayChange || !currentTraits) return;
		setArrayChange(
			traitsKey,
			currentTraits.filter((_, j) => j !== i),
		);
	}

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
				{isMultiTrait ? (
					currentTraits.map((trait, i) => {
						if ("sectional" in trait) {
							const titlePath = path
								? `${path}.traits.${i}.sectional.title`
								: null;
							return (
								<div key={i} className="mt-10">
									<p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
										{titlePath ? (
											<EditableText
												path={titlePath}
												value={trait.sectional.title}
												className="text-center"
											/>
										) : (
											trait.sectional.title
										)}
									</p>
									{trait.contributor && (
										<p className="text-xs text-white italic text-center mt-1 opacity-60">
											(Added by {trait.contributor.name})
										</p>
									)}
									{(isEditing || isContributing) && path && (
										<div className="flex justify-between items-center mt-2">
											<EditingButton
												onClick={() =>
													handleRemoveTrait(i)
												}
												variant="delete"
												icon={RiSubtractFill}
												title="Delete section"
											/>
											<EditingButton
												onClick={() =>
													handleAddTraitAfter(i)
												}
												variant="add"
												icon={RiAddFill}
												title="Add trait below section"
											/>
										</div>
									)}
								</div>
							);
						}
						return (
							<div key={i}>
								<Trait
									title={trait.title}
									desc={trait.desc}
									abilities={trait.abilities}
									path={
										path ? `${path}.traits.${i}` : undefined
									}
								/>
								{(isEditing || isContributing) && path && (
									<div className="flex justify-start mt-1 mb-2">
										<EditingButton
											onClick={() => handleRemoveTrait(i)}
											variant="delete"
											icon={RiDeleteBinLine}
											title="Delete trait"
										/>
									</div>
								)}
							</div>
						);
					})
				) : (
					<Trait
						title={title}
						desc={desc}
						abilities={abilities}
						path={path}
					/>
				)}

				{(isEditing || isContributing) && path && (
					<div className="mt-3 flex gap-2">
						<EditingButton
							onClick={() => handleAddTrait}
							variant="add"
							icon={RiAddFill}
							title="Add trait"
						>
							Add Trait
						</EditingButton>
						<EditingButton
							onClick={() => handleAddSection}
							variant="section"
							icon={RiAddFill}
							title="Add section header"
						>
							Add Section
						</EditingButton>
					</div>
				)}
			</div>
		</div>
	);
}
