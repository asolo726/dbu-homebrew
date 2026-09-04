"use client";
import Trait from "./Trait";
import type { Trait as TraitType } from "./Trait";
import { useEditingState } from "@/components/edit/useEditingState";
import { RiDeleteBinLine } from "react-icons/ri";
import { EditingButton } from "./util/EditingButton";

interface TraitsSectionProps {
	traits?: TraitType[];
	basePath?: string;
}

export default function TraitsSection({
	traits = [],
	basePath,
}: Readonly<TraitsSectionProps>) {
	const {
		isEditing,
		isContributing,
		contributorEmail,
		pendingChanges = {},
		setArrayChange,
	} = useEditingState();

	const isActive = isEditing || isContributing;

	const currentTraits =
		basePath && basePath in pendingChanges
			? pendingChanges[basePath]
			: (traits ?? []);

	// In contribute mode, users can only edit items they contributed themselves
	function canEditItem(item: any) {
		if (isEditing) return true;
		if (isContributing) return item.contributor?.email === contributorEmail;
		return false;
	}

	function removeAt(index: number) {
		if (!basePath || !setArrayChange || !Array.isArray(currentTraits))
			return;
		setArrayChange(
			basePath,
			currentTraits.filter((_: unknown, i: number) => i !== index),
		);
	}

	return (
		<>
			{Array.isArray(currentTraits) &&
				currentTraits.map((item: TraitType, index: number) => {
					const editable = canEditItem(item);

					return (
						<div key={index}>
							<Trait
								title={item.title}
								desc={item.desc}
								abilities={item.abilities}
								contributor={(item.contributor as any) ?? null}
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
