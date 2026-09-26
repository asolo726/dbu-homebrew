"use client";
import {
	aspects,
	getAspectTooltip,
	sortEditableAspects,
} from "../dbu/General/util/headUtil";
import { Tooltip } from "../../lib/reactTooltip.js";
import { useState, useEffect } from "react";
import { RxArrowUp, RxInfoCircled } from "react-icons/rx";

export default function AspectsModal({
	currentAspects,
	onSave,
	onClose,
	pendingChanges,
}) {
	const [editedAspects, setEditedAspects] = useState(
		pendingChanges?.["head.details.aspects"] ?? currentAspects,
	); // A copy of the current aspects, to be edited by the user.
	const [positiveAspectOptions, setPositiveAspectOptions] = useState([]);
	const [negativeAspectOptions, setNegativeAspectOptions] = useState([]);
	const [updatingAspect, setUpdatingAspect] = useState(false);
	const [enhancedSaveOptions, setEnhancedSaveOptions] = useState(
		{ Impulsive: false },
		{ Corporeal: false },
		{ Cognitive: false },
		{ Morale: false },
	);
	const [buttonStateStyles, setButtonStateStyles] = useState({
		Impulsive:
			"text-dbu-header text-sm leading-none w-3 h-3 border border-text-dbu-header rounded-full cursor-pointer",
		Corporeal:
			"text-dbu-header text-sm leading-none w-3 h-3 border border-text-dbu-header rounded-full cursor-pointer",
		Cognitive:
			"text-dbu-header text-sm leading-none w-3 h-3 border border-text-dbu-header rounded-full cursor-pointer",
		Morale: "text-dbu-header text-sm leading-none w-3 h-3 border border-text-dbu-header rounded-full cursor-pointer",
	});
	const SLUG_PATTERN = /^([1-9]\d{0,2})?$/;

	// const loadedPositiveAspects = aspects.filter((a) => a.isPositive);
	// const loadedNegativeAspects = aspects.filter((a) => !a.isPositive);
	// // Make an Aspect List for the select boxes, filtering out aspects that are already in currentAspects
	// Can reuse the code for the Toggle Select in SettingsClient, but this is simpler since we don't need
	// to worry about the "selected" state of the aspects, just the options available to select from

	// Filter the aspects to remove the ones that are already in editedAspects
	useEffect(() => {
		let currentNames = new Set(editedAspects.map((a) => a.name));
		setPositiveAspectOptions(
			aspects.filter((a) => a.isPositive && !currentNames.has(a.name)),
		);
		setNegativeAspectOptions(
			aspects.filter((a) => !a.isPositive && !currentNames.has(a.name)),
		);
	}, [editedAspects]);

	// Sort the aspects alphabetically and by positive/negative
	useEffect(() => {
		const sortAspects = async () => {
			const sortedAspects = await sortEditableAspects(editedAspects);
			setEditedAspects(sortedAspects);
		};
		sortAspects();
	}, [updatingAspect]);

	const removeAspect = (aspectName) => {
		const newEditedAspects = editedAspects.filter(
			(aspect) => aspect.name !== aspectName,
		);
		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
	};

	const addAspect = (aspect) => {
		let maxLevel = 0;
		if (Object.hasOwn(aspect, "maxLevel")) {
			maxLevel = aspect.maxLevel;
		}
		const aspectToAdd = {
			name: aspect.name,
			level: 1, // Placeholder
			maxLevel: maxLevel,
		};
		const newEditedAspects = [...editedAspects, aspectToAdd];
		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
	};

	const updateLevel = (aspect, level) => {
		const aspectToUpdate = {
			name: aspect.name,
			level: level,
			maxLevel: aspect.maxLevel,
		};
		const newEditedAspects = editedAspects.map((a) => {
			if (a.name === aspect.name) {
				return aspectToUpdate;
			}
			return a;
		});

		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
	};

	const normalAspectItemRender = (a, id) => {
		return (
			<div
				key={id}
				className="inline-flex items-center justify-between rounded-full border border-dbu-line bg-dbu-bg3 px-3 py-1 text-dbu-text text-sm text-center min-w-[10rem] max-w-[16rem] wrap-break-word"
			>
				<span
					data-tooltip-id="my-tooltip-2"
					data-tooltip-html={getAspectTooltip(a.name)}
					className="flex w-full cursor-help justify-center"
				>
					{a.name}
				</span>
				{Object.hasOwn(a, "maxLevel") && a.maxLevel !== 0 && (
					<>
						<input
							onChange={(e) => {
								if (SLUG_PATTERN.test(e.target.value)) {
									if (e.target.value <= a.maxLevel) {
										updateLevel(a, e.target.value);
									}
								}
							}}
							value={a.level}
							className="text-center w-7 text-dbu-header text-sm leading-none cursor-pointer border-text-dbu-header border-b"
						/>
						<span className="w-20 text-dbu-header text-sm leading-none">
							/ {a.maxLevel}
						</span>
					</>
				)}
				<button
					onClick={() => removeAspect(a.name)}
					className="ml-2 text-red-400/40 hover:text-red-400 text-sm leading-none cursor-pointer"
					title="Remove Aspect"
				>
					×
				</button>
			</div>
		);
	};

	const variantAspectRender = (a, id) => {};

	const enhancedSaveRender = (a, id) => {
		// Perhaps a 4 dot structure?
		// Impulsive, Corporeal, Cognitive, Morale
		return (
			<div
				key={id}
				className="flex-col inline-flex items-center justify-between rounded-full border border-dbu-line bg-dbu-bg3 px-3 py-1 text-dbu-text text-sm text-center min-w-[10rem] max-w-[16rem] wrap-break-word"
			>
				<div className="flex items-center">
					<span
						data-tooltip-id="my-tooltip-2"
						data-tooltip-html={getAspectTooltip(a.name)}
						className="flex w-full cursor-help justify-center"
					>
						Enhanced Save
					</span>
					<button
						onClick={() => removeAspect(a.name)}
						className="ml-3 text-red-400/40 hover:text-red-400 text-sm leading-none cursor-pointer"
						title="Remove Aspect"
					>
						×
					</button>
				</div>
				<div className="flex items-center gap-4">
					<button
						className={buttonStateStyles.Impulsive}
						onClick={() => updateEnhancedSave(a, "Impulsive")}
					></button>
					<button className={buttonStateStyles.Corporeal}></button>
					<button className={buttonStateStyles.Cognitive}></button>
					<button className={buttonStateStyles.Morale}></button>
				</div>
			</div>
		);
	};

	const updateEnhancedSave = (aspect, SaveType) => {
		const newEnhancedSaveOptions = enhancedSaveOptions;
		enhancedSaveOptions[SaveType] = !enhancedSaveOptions[SaveType];
		// Updates Button Styles
		if (newEnhancedSaveOptions[SaveType]) {
			setButtonStateStyles((prevState) => ({
				...prevState,
				[SaveType]: prevState[SaveType] + " bg-dbu-header",
			}));
		} else {
			setButtonStateStyles((prevState) => ({
				...prevState,
				[SaveType]: prevState[SaveType].replace(" bg-dbu-header", ""),
			}));
		}
		// Updates Aspect Array
		const newEditedAspects = editedAspects.map((a) => {
			if (a.name.includes("Enhanced Save")) {
				const newAspectName = enhancedSaveNameBuilder(enhancedSaveOptions, SaveType, a.name);
				a.name = newAspectName;
				return a;
			}
		});
		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
		setEnhancedSaveOptions(newEnhancedSaveOptions);
	};

	const enhancedSaveNameBuilder = (enhancedSaveOptions, SaveType, startingName) => {
		let newAspectName = "Enhanced Save [";
		// First check if there's only 1 option set to true, if so, return that option

		return newAspectName;
	};

	const innateStateRender = (a, id) => {};

	return (
		<div
			className="fixed inset-0 bg-black/60 flex items-center justify-center z-60"
			onClick={onClose}
		>
			<div
				className="bg-dbu-bg2 border border-dbu-line rounded-lg w-full max-w-3xl mx-4 shadow-2xl overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-dbu-line">
					<h1 className="text-dbu-header font-semibold flex flex-wrap justify-center">
						Aspects Editor
					</h1>
				</div>

				{/* Body [Aspects display] */}
				<div className="px-6 py-4 max-h-[70vh] overflow-y-auto bg-white/5">
					<div className="flex flex-wrap justify-center gap-3 max-w-full">
						{editedAspects.map((a, id) => {
							if (a.name.includes("Enhanced Save")) {
								return enhancedSaveRender(a, id);
							} else if (a.name === "Innate State") {
								return innateStateRender(a, id);
							} else if (a.name === "Variant") {
								return variantAspectRender(a, id);
							} else {
								return normalAspectItemRender(a, id);
							}
						})}
					</div>
				</div>

				{/* Body [Aspects picker] */}
				<div className="flex gap-6">
					<div className="flex-1">
						<label className="text-dbu-header font-semibold mb-2 flex justify-center">
							Positive Aspects
						</label>
						<div className="w-full h-[40vh] border space-y-1 border-dbu-line rounded overflow-y-auto p-2 bg-dbu-bg3 text-dbu-text">
							{positiveAspectOptions.map((a) => (
								<button
									key={a.name}
									value={a.name}
									onClick={() => addAspect(a)}
									className="flex items-center justify-between w-full px-3 py-2 text-sm text-dbu-text hover:bg-dbu-line rounded transition-colors cursor-pointer gap-2"
								>
									<span className="truncate min-w-0">
										{a.name}
									</span>
									<RxArrowUp className="flex justify-between shrink-0" />
								</button>
							))}
						</div>
					</div>
					<div className="flex-1">
						<label className="text-dbu-header font-semibold mb-2 flex justify-center">
							Negative Aspects
						</label>
						<div className="w-full h-[40vh] border space-y-1 border-dbu-line rounded overflow-y-auto p-2 bg-dbu-bg3 text-dbu-text">
							{negativeAspectOptions.map((a) => (
								<button
									key={a.name}
									value={a.name}
									onClick={() => addAspect(a)}
									className="flex items-center justify-between w-full px-3 py-2 text-sm text-dbu-text hover:bg-dbu-line rounded transition-colors cursor-pointer gap-2"
								>
									<span className="truncate min-w-0">
										{a.name}
									</span>
									<RxArrowUp className="flex justify-between shrink-0" />
								</button>
							))}
						</div>
					</div>
				</div>
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
							onSave(editedAspects);
							setEditedAspects(
								pendingChanges?.["head.details.aspects"],
							);
						}}
					>
						Save
					</button>
				</div>
			</div>
			<Tooltip
				id="my-tooltip-2"
				className="tooltip z-30"
				style={{ maxWidth: "400px" }}
			/>
		</div>
	);
}
