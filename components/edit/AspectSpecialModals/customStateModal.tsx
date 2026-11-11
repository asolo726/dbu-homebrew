"use client";
import { useState } from "react";
import {
	InnateState,
	Ability,
	Level,
} from "@/components/edit/util/innateStateTooltips";

interface CustomStateModalProps {
	setCustomStateWindowToggle: React.Dispatch<React.SetStateAction<boolean>>;
	editedAspects: any;
}

export default function CustomStateModal({
	setCustomStateWindowToggle,
	editedAspects,
}: CustomStateModalProps) {
	const [customStateName, setCustomStateName] = useState("");
	const [hasNarrativeReq, setHasNarrativeReq] = useState(false);
	const [narrativeReq, setNarrativeReq] = useState("");
	const [hasLevels, setHasLevels] = useState(false);
	const [levels, setLevels] = useState<Level[]>([
		{ levelName: "", abilities: [{ condition: "", desc: "" }] },
	]);
	const [abilities, setAbilities] = useState<Ability[]>([
		{ condition: "", desc: "" },
	]);

	const onClose = () => {
		setCustomStateWindowToggle(false);
	};

	const addState = () => {};

	const updateLevelName = (levelName: string, key: number) => {
		const newLevels = [...levels];
		newLevels[key].levelName = levelName;
		setLevels(newLevels);
	};

	const updateLevelAbilityCondition = (
		condition: string,
		levelKey: number,
		abilityKey: number,
	) => {
		const newLevels = [...levels];
		newLevels[levelKey].abilities[abilityKey].condition = condition;
		setLevels(newLevels);
	};
	const updateLevelAbilityDesc = (
		desc: string,
		levelKey: number,
		abilityKey: number,
	) => {
		const newLevels = [...levels];
		newLevels[levelKey].abilities[abilityKey].desc = desc;
		setLevels(newLevels);
	};

	const updateAbilityCondition = (condition: string, abilityKey: number) => {
		const newAbilities = [...abilities];
		newAbilities[abilityKey].condition = condition;
		setAbilities(newAbilities);
	};

	const updateAbilityDesc = (desc: string, abilityKey: number) => {
		const newAbilities = [...abilities];
		newAbilities[abilityKey].desc = desc;
		setAbilities(newAbilities);
	};

	const addLevel = () => {
		const newLevel = {
			levelName: "",
			abilities: [
				{
					condition: "",
					desc: "",
				},
			],
		};
		const newLLevels = [...levels, newLevel];
		setLevels(newLLevels);
	};
	const addLevelAbility = (levelKey: number) => {
		const newLevels = [...levels];
		newLevels[levelKey].abilities.push({
			condition: "",
			desc: "",
		});
		setLevels(newLevels);
	};

	const addAbility = () => {
		const newAbility = {
			condition: "",
			desc: "",
		};
		const newAbilities = [...abilities, newAbility];
		setAbilities(newAbilities);
	};

	const removeLevelAbility = (levelKey: number, abilityKey: number) => {
		const newLevels = [...levels];
		newLevels[levelKey].abilities.splice(abilityKey, 1);
		setLevels(newLevels);
	};

	const removeAbility = (abilityKey: number) => {
		const newAbilities = [...abilities];
		newAbilities.splice(abilityKey, 1);
		setAbilities(newAbilities);
	};

	const renderEditLevels = () => {
		return (
			<div className="pl-2">
				{/* <div className="flex flex-col">
					<span className="pt-1 text-dbu-text">Levels: </span>
				</div> */}
				<div className="p-3 flex flex-wrap flex-row w-full">
					{levels.map((level, levelKey) => {
						return (
							<div
								className="p-3 border-2 border-dbu-header w-full mt-3"
								key={levelKey}
							>
								<div className="flex flex-row">
									<span className="text-dbu-text font-bold">
										Level Name
									</span>
									<input
										className="mx-5 pl-2 text-md focus:outline-none focus:ring-0 border-dbu-header border-b rounded"
										type="text"
										onChange={(e) =>
											updateLevelName(
												e.target.value,
												levelKey,
											)
										}
									/>
								</div>
								<div className="ml-3 flex flex-col">
									<span className="text-dbu-text font-bold">
										Abilities
									</span>
									<div className="flex flex-col w-full">
										{level.abilities.map(
											(ability, abilityKey) => {
												return (
													<div
														className="flex flex-row py-1"
														key={abilityKey}
													>
														<div className="flex flex-col w-full">
															<textarea
																className="pl-2 field-sizing-content resize-none min-w-50 focus:outline-none focus:ring-0 border-dbu-header border-b rounded"
																onChange={(e) =>
																	updateLevelAbilityCondition(
																		e.target
																			.value,
																		levelKey,
																		abilityKey,
																	)
																}
																value={
																	ability.condition
																}
																placeholder="Condition"
															/>
															<textarea
																className="pl-2 field-sizing-content resize-none block min-w-30 sm:min-w-80 w-full focus:outline-none focus:ring-0 border-dbu-header border-b rounded"
																onChange={(e) =>
																	updateLevelAbilityDesc(
																		e.target
																			.value,
																		levelKey,
																		abilityKey,
																	)
																}
																value={
																	ability.desc
																}
																placeholder="Description"
															/>
														</div>
														<div className="flex flex-row justify-end">
															<button
																className="mx-3 px-3 py-1 max-w-25 place-self-end rounded bg-dbu-link hover:bg-dbu-link-hover"
																onClick={() => {
																	removeLevelAbility(
																		levelKey,
																		abilityKey,
																	);
																}}
															>
																X
															</button>
														</div>
													</div>
												);
											},
										)}
									</div>
									<div className="flex flex-row w-full justify-end">
										<button
											className=" mt-5 mb-2 mx-3 px-3 pb-1 rounded bg-dbu-link hover:bg-dbu-link-hover"
											onClick={() => {
												addLevelAbility(levelKey);
											}}
										>
											Add Ability
										</button>
									</div>
								</div>
							</div>
						);
					})}
					<div className="mt-2 self-end">
						<button
							className="mx-3 px-3 pb-1 rounded bg-dbu-link hover:bg-dbu-link-hover"
							onClick={addLevel}
						>
							Add Level
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderEditAbilities = () => {
		return (
			<div>
				<span className="text-dbu-text text-lg font-bold" >Abilities</span>
				{abilities.map((ability, abilityKey) => {
					return (
						<div className="flex flex-row py-1" key={abilityKey}>
							<div className="flex flex-col w-full">
								<textarea
									className="pl-2 field-sizing-content resize-none min-w-50 focus:outline-none focus:ring-0 border-dbu-header border-b rounded"
									onChange={(e) =>
										updateAbilityCondition(
											e.target.value,
											abilityKey,
										)
									}
									value={ability.condition}
									placeholder="Condition"
								/>
								<textarea
									className="pl-2 field-sizing-content resize-none block min-w-30 sm:min-w-80 w-full focus:outline-none focus:ring-0 border-dbu-header border-b rounded"
									onChange={(e) =>
										updateAbilityDesc(
											e.target.value,
											abilityKey,
										)
									}
									value={ability.desc}
									placeholder="Description"
								/>
							</div>
							<div className="flex flex-row justify-end">
								<button
									className="mx-3 px-3 py-1 max-w-25 place-self-end rounded bg-dbu-link hover:bg-dbu-link-hover"
									onClick={() => {
										removeAbility(abilityKey);
									}}
								>
									X
								</button>
							</div>
						</div>
					);
				})}
				<div className="flex flex-row w-full justify-end">
					<button
						className=" mt-5 mb-2 mx-3 px-3 pb-1 rounded bg-dbu-link hover:bg-dbu-link-hover"
						onClick={() => {
							addAbility();
						}}
					>
						Add Ability
					</button>
				</div>
			</div>
		);
	};

	const renderPreviewAbilities = () => {
		return abilities.map((ability, key) => {
			return (
				<p
					className="flex text-sm leading-relaxed text-white-100"
					key={key}
				>
					{"("}
					<span className="font-bold text-dbu-header">{key + 1}</span>
					{")-"}
					{"["}
					<span className="font-bold text-dbu-header">
						{ability.condition}
					</span>
					<span>{"]"}</span>
					<span className="pr-1"> : </span>
					<span className="text-white-100">{ability.desc}</span>
				</p>
			);
		});
	};

	const renderPreviewLevels = () => {
		return levels.map((level, levelKey) => {
			return (
				<div className="mt-2" key={levelKey}>
					<span className="text-md font-bold text-dbu-header mb-1">
						{level.levelName} {`(Level ${levelKey + 1})`}
					</span>
					{level.abilities.map((ability, abilityKey) => {
						return (
							<div
								className="text-sm leading-relaxed text-white-100"
								key={abilityKey}
							>
								<p>
									{"("}
									<span className="font-bold text-dbu-header">
										{abilityKey + 1}
									</span>
									{")-"}
									<span className="text-nowrap">{"["}</span>
									<span className="font-bold text-dbu-header text-nowrap">
										{ability.condition}
									</span>
									<span>{"]"}</span>
									<span>: </span>
									<span className="text-white-100 text-wrap max-w-100">
										{ability.desc}
									</span>
								</p>
							</div>
						);
					})}
				</div>
			);
		});
	};

	return (
		<div
			className="fixed inset-0 bg-black/80 flex items-center justify-center z-80"
			// onClick={onClose}
		>
			<div
				className=" bg-dbu-bg2 border border-dbu-line rounded-lg w-full max-w-7xl mx-4 shadow-2xl overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-dbu-line">
					<h1 className="text-2xl text-dbu-header font-semibold flex flex-wrap justify-center">
						Custom State Creator & Preview
					</h1>
				</div>
				<div className="overflow-y-auto max-h-175 xxl:max-h-200 flex xl:flex-row flex-col">
					{/* Left Side Editor */}
					<div className="xl:min-w-2/3 w-full xl:w-2/3 ">
						{/* Body */}
						<div className="">
							<div className="px-6 py-4 flex flex-col xl:border-r-3 border-dbu-header ">
								<div className="flex flex-row mb-3">
									<span className="pt-1 text-dbu-text font-bold">
										Name
									</span>
									<input
										type="text"
										className="text-md mx-4 border-b border-dbu-header rounded px-2 py-1 text-dbu-text focus:outline-none focus:ring-0"
										onChange={(e) =>
											setCustomStateName(e.target.value)
										}
									/>
								</div>
								{/* Narrative Req */}
								<div className="flex flex-row flex-wrap mb-2">
									<span className="text-dbu-text font-bold">
										{" "}
										Narrative Requirement /
										Description?{" "}
									</span>
									<input
										className="mx-5 w-5"
										type="checkbox"
										onChange={(e) =>
											setHasNarrativeReq(e.target.checked)
										}
									/>
								</div>
								{hasNarrativeReq && (
									<div className="mb-5">
										<textarea
											placeholder="That's right... give it Aura..."
											rows={2}
											className="w-full block min-h-6 border-b border-dbu-header rounded px-2 py-1 field-sizing-content resize-none text-dbu-text focus:outline-none focus:ring-0"
											onChange={(e) =>
												setNarrativeReq(
													e.target.value,
												)
											}
										/>
									</div>
								)}
								{/* Levels */}
								<div className="flex flex-row mb-5">
									<span className="pt-1 text-dbu-text font-bold">
										Levels?
									</span>
									<input
										className="mx-5 w-5"
										type="checkbox"
										onChange={(e) =>
											setHasLevels(e.target.checked)
										}
									/>
								</div>
								{hasLevels && renderEditLevels()}
								{/*Only Abilities */}
								{!hasLevels && renderEditAbilities()}
							</div>
						</div>
					</div>
					{/* Preview */}
					<div className="border-t-3 border-dbu-header xl:border-t-0 p-5">
						<div className="">
							<span className="font-bold text-dbu-header text-2xl">
								{customStateName}
							</span>
							<br />
							<span className="italic text-sm mb-2 text-white-100">
								{narrativeReq}
							</span>
						</div>
						{hasLevels && <div>{renderPreviewLevels()}</div>}
						{!hasLevels && <div>{renderPreviewAbilities()}</div>}
					</div>
				</div>
				{/* Bottom Buttons */}
				<div className="px-6 py-4 border-t border-dbu-line flex justify-end gap-2">
					<button
						className="px-4 py-2 rounded border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 rounded bg-dbu-link  text-white hover:bg-dbu-link/90 cursor-pointer"
						onClick={() => {
							addState();
							onClose();
						}}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
