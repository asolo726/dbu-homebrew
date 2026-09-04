"use client";
import AddendumBox from "./DBUBox";
import Table from "./table";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";
import type { TableData } from "./table";
import type { Section } from "./Section";

export interface DBUBox {
	boxTitle?: string;
	body: Section[];
}

export interface MiniTraitList {
	condition: string;
	desc: string;
}

export interface Ability {
	condition?: string;
	desc?: string;
	list?: string[];
	listIndent?: number; // This is used to determine the level of indentation for a list. Supports up to three levels (with 0 (default), 1, and 2)
	miniTraitList?: MiniTraitList[];
	addendumBox?: DBUBox;
	table?: TableData;
}

interface AbilityProps {
	abilityList: Ability[];
	path: string | undefined;
	selectedIndices?: Set<number> | undefined;
	onToggleSelect?: (index: number) => void;
	onMove?: (index: number, direction: number) => void;
	onUpdateAbility?: (abilityIndex: number, op: any) => void;
}

export default function Ability({
	abilityList = [{}],
	path,
	selectedIndices,
	onToggleSelect,
	onMove,
	onUpdateAbility,
}: Readonly<AbilityProps>) {
	const { isEditing, isContributing } = useEditMode() || {};
	const canEdit = isEditing || isContributing;
	let conditionAbilityCount = 0;

	return (
		<div className="mt-2">
			{abilityList.map((item, itemIndex) => {
				// Build the inner content for this item (no key — key goes on the wrapper)
				let inner;

				if (typeof item.condition === "string") {
					const isLabel =
						item.condition.startsWith("–") ||
						item.condition.startsWith("-");

					if (isLabel) {
						inner = (
							<p className="text-dbu-text text-md md:text-lg text-left my-1">
								{/* In view mode show – as static prefix; in edit mode it's part of the editable condition string */}
								{!canEdit}
								<span className="font-bold text-dbu-header">
									<EditableText
										path={
											path
												? `${path}.abilities.${itemIndex}.condition`
												: undefined
										}
										value={item.condition}
									/>
								</span>
								{": "}
								<EditableText
									path={
										path
											? `${path}.abilities.${itemIndex}.desc`
											: undefined
									}
									value={item.desc}
								/>
							</p>
						);
					} else {
						conditionAbilityCount++;
						inner = (
							<p className="text-dbu-text text-md md:text-lg text-left my-1">
								{"("}
								<span className="font-bold text-dbu-header">
									{conditionAbilityCount}
								</span>
								{")-["}
								<span className="font-bold text-dbu-header">
									<EditableText
										path={
											path
												? `${path}.abilities.${itemIndex}.condition`
												: undefined
										}
										value={item.condition}
									/>
								</span>
								{"]: "}
								<EditableText
									path={
										path
											? `${path}.abilities.${itemIndex}.desc`
											: undefined
									}
									value={item.desc}
								/>
							</p>
						);
					}
				} else if (Array.isArray(item.list)) {
					const depth = item.listIndent ?? 0;
					const marginLeft = `${(depth + 1) * 2.5}rem`;
					const listStyleType =
						depth >= 2 ? "square" : depth >= 1 ? "circle" : "disc";
					inner = (
						<div>
							<ul style={{ marginLeft, listStyleType }}>
								{item.list.map((listItem, i) => (
									<li
										className="my-2 text-dbu-text text-md md:text-lg text-left"
										key={i}
									>
										<EditableText
											path={
												path
													? `${path}.abilities.${itemIndex}.list.${i}`
													: undefined
											}
											value={listItem}
										/>
										{canEdit && onUpdateAbility && (
											<button
												onClick={() =>
													onUpdateAbility(itemIndex, {
														type: "list:remove",
														index: i,
													})
												}
												className="ml-2 text-red-400/40 hover:text-red-400 text-sm leading-none"
												title="Remove bullet"
											>
												×
											</button>
										)}
									</li>
								))}
							</ul>
							{canEdit && onUpdateAbility && (
								<button
									onClick={() =>
										onUpdateAbility(itemIndex, {
											type: "list:add",
										})
									}
									style={{ marginLeft }}
									className="text-xs text-dbu-text/40 hover:text-dbu-header mt-0.5"
								>
									+ Add bullet
								</button>
							)}
						</div>
					);
				} else if (Array.isArray(item.miniTraitList)) {
					const depth = item.listIndent ?? 0;
					const marginLeft = `${(depth + 1) * 2.5}rem`;
					const listStyleType =
						depth >= 2 ? "square" : depth >= 1 ? "circle" : "disc";
					inner = (
						<div>
							<ul style={{ marginLeft, listStyleType }}>
								{item.miniTraitList.map((listItem, i) => (
									<li
										className="my-2 text-dbu-text text-md md:text-lg text-left"
										key={i}
									>
										<span className="font-bold text-dbu-header">
											<EditableText
												path={
													path
														? `${path}.abilities.${itemIndex}.miniTraitList.${i}.title`
														: undefined
												}
												value={listItem.condition}
											/>
											:{" "}
										</span>
										<EditableText
											path={
												path
													? `${path}.abilities.${itemIndex}.miniTraitList.${i}.desc`
													: undefined
											}
											value={listItem.desc}
										/>
										{canEdit && onUpdateAbility && (
											<button
												onClick={() =>
													onUpdateAbility(itemIndex, {
														type: "miniTraitList:remove",
														index: i,
													})
												}
												className="ml-2 text-red-400/40 hover:text-red-400 text-sm leading-none"
												title="Remove item"
											>
												×
											</button>
										)}
									</li>
								))}
							</ul>
							{canEdit && onUpdateAbility && (
								<button
									onClick={() =>
										onUpdateAbility(itemIndex, {
											type: "miniTraitList:add",
										})
									}
									style={{ marginLeft }}
									className="text-xs text-dbu-text/40 hover:text-dbu-header mt-0.5"
								>
									+ Add item
								</button>
							)}
						</div>
					);
				} else if (item.addendumBox) {
					const depth = item.listIndent ?? -1;
					const marginLeft =
						depth >= 0 ? `${(depth + 1) * 2.5}rem` : undefined;
					inner = (
						<div style={marginLeft ? { marginLeft } : {}}>
							<AddendumBox
								boxTitle={item.addendumBox.boxTitle}
								title={item.addendumBox.title}
								desc={item.addendumBox.desc}
								abilities={item.addendumBox.abilities}
								traits={item.addendumBox.traits}
								path={
									path
										? `${path}.abilities.${itemIndex}.addendumBox`
										: undefined
								}
							/>
						</div>
					);
				} else if (item.table) {
					inner = (
						<ul className="list-disc ml-10">
							<Table
								tableData={{
									columns: item.table.columns,
									rows: item.table.rows,
								}}
							/>
						</ul>
					);
				}

				if (inner == null) return null;

				// In edit mode wrap each item with a checkbox + move buttons for selection/reordering
				if (canEdit && onToggleSelect) {
					const checked = selectedIndices?.has(itemIndex) ?? false;
					const isFirst = itemIndex === 0;
					const isLast = itemIndex === abilityList.length - 1;
					return (
						<div
							key={itemIndex}
							className={`flex items-start gap-1 rounded transition-colors ${
								checked ? "bg-red-900/20" : ""
							}`}
						>
							<input
								type="checkbox"
								checked={checked}
								onChange={() => onToggleSelect(itemIndex)}
								className="mt-2 shrink-0 accent-red-500 cursor-pointer"
							/>
							{onMove && (
								<div className="flex flex-col shrink-0 mt-0.5">
									<button
										onClick={() => onMove(itemIndex, -1)}
										disabled={isFirst}
										title="Move up"
										className="text-dbu-text/50 hover:text-dbu-header disabled:opacity-20 disabled:cursor-not-allowed leading-none"
									>
										<RiArrowUpLine size={14} />
									</button>
									<button
										onClick={() => onMove(itemIndex, 1)}
										disabled={isLast}
										title="Move down"
										className="text-dbu-text/50 hover:text-dbu-header disabled:opacity-20 disabled:cursor-not-allowed leading-none"
									>
										<RiArrowDownLine size={14} />
									</button>
								</div>
							)}
							<div className="flex-1 min-w-0">{inner}</div>
						</div>
					);
				}

				return <div key={itemIndex}>{inner}</div>;
			})}
		</div>
	);
}
