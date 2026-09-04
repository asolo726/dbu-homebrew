"use client";
import { useState, useEffect } from "react";
import Ability, { type Ability as AbilityType } from "./ability";
import EditableText from "../../edit/EditableText";
import AddAbilityModal from "../../edit/AddAbilityModal";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";
import { EditingButton } from "./util/EditingButton";
import { useEditingState } from "@/components/edit/useEditingState";

type AbilityOperation =
	| { type: "list:add" }
	| { type: "list:remove"; index: number }
	| { type: "miniTraitList:add" }
	| { type: "miniTraitList:remove"; index: number };

export interface Trait {
	title: string;
	desc: string;
	abilities: AbilityType[];
	path: string | undefined;
	disableEditActions?: boolean;
	contributor?: {
		email?: string;
		name?: string;
	};
}

export default function Trait({
	title = "",
	desc = "",
	abilities,
	path,
	disableEditActions = false,
	contributor,
}: Readonly<Trait>) {
	const {
		isEditing,
		isContributing,
		pendingChanges = {},
		setArrayChange,
	} = useEditingState();
	const canEditContent = (isEditing || isContributing) && path;

	const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
		new Set(),
	);
	const [showAddModal, setShowAddModal] = useState(false);

	// Reset selection when edit mode exits
	useEffect(() => {
		if (!isEditing) {
			setSelectedIndices(new Set());
			setShowAddModal(false);
		}
	}, [isEditing]);

	const abilitiesKey = path ? `${path}.abilities` : "";
	const currentAbilities =
		abilitiesKey && abilitiesKey in pendingChanges
			? pendingChanges[abilitiesKey]
			: (abilities ?? []);

	function getPathKey(segment: string): string | number {
		const numericSegment = Number(segment);
		return Number.isNaN(numericSegment) ? segment : numericSegment;
	}

	// Merge scalar edits (e.g. individual bullet text changes) into the base array
	// before any structural operation so we don't lose in-progress text edits.
	function resolveCurrentAbilities() {
		const base =
			abilitiesKey && abilitiesKey in pendingChanges
				? pendingChanges[abilitiesKey]
				: (abilities ?? []);
		if (!abilitiesKey) return base;
		const prefix = abilitiesKey + ".";
		const scalarKeys = Object.keys(pendingChanges).filter((k) =>
			k.startsWith(prefix),
		);
		if (scalarKeys.length === 0) return base;
		const arr = JSON.parse(JSON.stringify(base));
		for (const key of scalarKeys) {
			const parts = key.slice(prefix.length).split(".");
			let obj = arr;
			let valid = true;
			for (let j = 0; j < parts.length - 1; j++) {
				const seg = parts[j];
				const next = obj[getPathKey(seg)];
				if (next == null) {
					valid = false;
					break;
				}
				obj = next;
			}
			if (valid) {
				const last = parts[parts.length - 1];
				obj[getPathKey(last)] = pendingChanges[key];
			}
		}
		return arr;
	}

	function toggleSelect(index: number) {
		setSelectedIndices((prev) => {
			const next = new Set(prev);
			next.has(index) ? next.delete(index) : next.add(index);
			return next;
		});
	}

	function handleAdd(newAbility: AbilityType) {
		if (!path || !setArrayChange) return;

		setArrayChange(abilitiesKey, [
			...resolveCurrentAbilities(),
			newAbility,
		]);
		setShowAddModal(false);
	}

	function handleRemove() {
		if (!path || !setArrayChange || selectedIndices.size === 0) return;
		const filtered = resolveCurrentAbilities().filter(
			(_: AbilityType, i: number) => !selectedIndices.has(i),
		);
		setArrayChange(abilitiesKey, filtered);
		setSelectedIndices(new Set());
	}

	function handleMove(index: number, direction: number) {
		if (!path || !setArrayChange) return;
		const resolved = resolveCurrentAbilities();
		const target = index + direction;
		if (target < 0 || target >= resolved.length) return;
		const arr = [...resolved];
		[arr[index], arr[target]] = [arr[target], arr[index]];
		setArrayChange(abilitiesKey, arr);
		setSelectedIndices((prev) => {
			const next = new Set<number>(prev);
			for (const i of prev) {
				if (i === index) next.add(target);
				else if (i === target) next.add(index);
				else next.add(i);
			}
			return next;
		});
	}

	function handleUpdateAbility(abilityIndex: number, op: AbilityOperation) {
		if (!path || !setArrayChange) return;
		const arr = resolveCurrentAbilities().map(
			(item: AbilityType, i: number) => {
				const list = item.list ?? []; // Since these are optional types, we need to define them here to avoid a typescript error.
				const miniTraitList = item.miniTraitList ?? [];
				if (i !== abilityIndex) return item;
				if (op.type === "list:add") {
					return { ...item, list: [...(item.list ?? []), ""] };
				}
				if (op.type === "list:remove") {
					return {
						...item,
						list: list.filter(
							(_: any, j: number) => j !== op.index,
						),
					};
				}
				if (op.type === "miniTraitList:add") {
					return {
						...item,
						miniTraitList: [
							...(item.miniTraitList ?? []),
							{ title: "", desc: "" },
						],
					};
				}
				if (op.type === "miniTraitList:remove") {
					return {
						...item,
						miniTraitList: miniTraitList.filter(
							(_: any, j: number) => j !== op.index,
						),
					};
				}
				return item;
			},
		);
		setArrayChange(abilitiesKey, arr);
	}

	return (
		<div className="flex-grow-1 mt-4">
			{canEditContent && path ? (
				<p className="text-dbu-text text-md md:text-lg text-left">
					<span className="font-bold text-dbu-header">
						<EditableText path={`${path}.title`} value={title} />
						:{" "}
					</span>
					<EditableText path={`${path}.desc`} value={desc} />
				</p>
			) : title !== "" || desc !== "" ? (
				<p className="text-dbu-text text-md md:text-lg text-left">
					{title !== "" && (
						<span className="font-bold text-dbu-header">
							<EditableText
								path={`${path}.title`}
								value={title}
							/>
							:{" "}
						</span>
					)}
					<EditableText path={`${path}.desc`} value={desc} />
				</p>
			) : null}

			<Ability
				abilityList={currentAbilities}
				path={path}
				selectedIndices={
					disableEditActions ? undefined : selectedIndices
				}
				onToggleSelect={disableEditActions ? undefined : toggleSelect}
				onMove={disableEditActions ? undefined : handleMove}
				onUpdateAbility={
					disableEditActions ? undefined : handleUpdateAbility
				}
			/>

			{/* Add / Remove buttons — only in edit mode, only when a path exists, and not inside AddendumBox */}
			{canEditContent && (
				<div className="flex justify-between items-center mt-3">
					{/* Remove selected — bottom left, red */}
					<EditingButton
						title="Remove selected abilities"
						onClick={handleRemove}
						disabled={selectedIndices.size === 0}
						icon={RiSubtractFill}
						variant="remove"
					>
						{selectedIndices.size > 0 && (
							<span className="text-xs">
								{selectedIndices.size}
							</span>
						)}
					</EditingButton>

					{/* Add ability — bottom right, white */}
					<EditingButton
						onClick={() => setShowAddModal(true)}
						title="Add ability"
						icon={RiAddFill}
						variant="add"
					/>
				</div>
			)}

			{canEditContent && showAddModal && (
				<AddAbilityModal
					onSave={handleAdd}
					onClose={() => setShowAddModal(false)}
				/>
			)}

			{contributor && (
				<p className="text-xs text-white italic mt-2 opacity-60">
					(Added by {contributor.name})
				</p>
			)}
		</div>
	);
}
