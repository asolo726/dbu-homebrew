"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiAddFill, RiSubtractFill, RiDeleteBinLine } from "react-icons/ri";
import { EditingButton } from "./util/EditingButton";

export default function TraitsSection({ traits = [], basePath }) {
	const ctx = useEditMode();
	const isEditing = ctx?.isEditing ?? false;
	const isContributing = ctx?.isContributing ?? false;
	const isCommunity = ctx?.isCommunity ?? false;
	const contributorEmail = ctx?.contributorEmail ?? null;
	const contributorName = ctx?.contributorName ?? null;
	const pendingChanges = ctx?.pendingChanges ?? {};
	const setArrayChange = ctx?.setArrayChange;

	const isActive = isEditing || isContributing;

	const currentTraits =
		basePath && basePath in pendingChanges
			? pendingChanges[basePath]
			: traits;

	// In contribute mode, users can only edit items they contributed themselves
	function canEditItem(item) {
		if (isEditing) return true;
		if (isContributing) return item.contributor?.email === contributorEmail;
		return false;
		``;
	}

	function addAt(index, item) {
		if (!basePath || !setArrayChange) return;
		const arr = [...currentTraits];
		arr.splice(index, 0, item);
		setArrayChange(basePath, arr);
	}

	function removeAt(index) {
		if (!basePath || !setArrayChange) return;
		setArrayChange(
			basePath,
			currentTraits.filter((_, i) => i !== index),
		);
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

	function newTrait() {
		return withContributor({
			title: "New Trait",
			desc: "Description",
			abilities: [],
		});
	}

	function newSection() {
		return withContributor({ sectional: { title: "New Section" } });
	}

	function handleAddTrait() {
		addAt(currentTraits.length, newTrait());
	}

	function handleAddSection() {
		addAt(currentTraits.length, newSection());
	}

	return (
		<>
			{currentTraits.map((item, index) => {
				const editable = canEditItem(item);

				return (
					<div key={index}>
						<Trait
							title={item.title}
							desc={item.desc}
							abilities={item.abilities}
							contributor={item.contributor ?? null}
							disableEditActions={!editable}
							path={
								basePath && editable
									? `${basePath}.${index}`
									: undefined
							}
						/>
						{isActive && basePath && editable && (
							<div className="flex justify-start mt-1 mb-2">
								<EditingButton
									onClick={() => removeAt(index)}
									title="Delete trait"
									icon={RiDeleteBinLine}
									variant="delete"
								/>
							</div>
						)}
					</div>
				);
			})}
		</>
	);
}
