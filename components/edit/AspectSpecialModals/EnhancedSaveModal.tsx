"use client";
import { useState, useEffect } from "react";

interface EnhancedSaveOptions {
	[key: string]: string | boolean;
	Impulsive: boolean;
	Corporeal: boolean;
	Cognitive: boolean;
	Morale: boolean;
}

interface EnhancedSaveButtonStyles {
	[key: string]: string;
	Impulsive: string;
	Corporeal: string;
	Cognitive: string;
	Morale: string;
}

interface EnhancedSaveModalProps {
	EnhancedSaveName: string;
	setEnhancedSaveName: React.Dispatch<React.SetStateAction<string>>;
	setEnhancedWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUpdatingAspect: React.Dispatch<React.SetStateAction<boolean>>;
	updatingAspect: boolean;
	setEditedAspects: React.Dispatch<React.SetStateAction<any>>;
	editedAspects: any;
}

export default function EnhancedSaveModal({
	EnhancedSaveName,
	setEnhancedSaveName,
	setEnhancedWindowOpen,
	setUpdatingAspect,
	updatingAspect,
	setEditedAspects,
	editedAspects,
}: Readonly<EnhancedSaveModalProps>) {
	const [enhancedSaveOptions, setEnhancedSaveOptions] =
		useState<EnhancedSaveOptions>({
			Impulsive: false,
			Corporeal: false,
			Cognitive: false,
			Morale: false,
		});
	const [previewName, setPreviewName] = useState("Enhanced Save");
	const [buttonStateStyles, setButtonStateStyles] =
		useState<EnhancedSaveButtonStyles>({
			Impulsive:
				"text-dbu-header leading-none border border-text-dbu-header rounded-full cursor-pointer",
			Corporeal:
				" text-dbu-header leading-none border border-text-dbu-header rounded-full cursor-pointer",
			Cognitive:
				" text-dbu-header leading-none border border-text-dbu-header rounded-full cursor-pointer",
			Morale: " text-dbu-header leading-none border border-text-dbu-header rounded-full cursor-pointer",
		});

	const onClose = () => {
		console.log("Closing Enhanced Modal");
		setEnhancedWindowOpen(false);
	};

	const readEnhancedSaveOptions = () => {
		let options = {
			Impulsive: false,
			Corporeal: false,
			Cognitive: false,
			Morale: false,
		};
		if (EnhancedSaveName.includes("Impulsive")) {
			options.Impulsive = true;
		}
		if (EnhancedSaveName.includes("Corporeal")) {
			options.Corporeal = true;
		}
		if (EnhancedSaveName.includes("Cognitive")) {
			options.Cognitive = true;
		}
		if (EnhancedSaveName.includes("Morale")) {
			options.Morale = true;
		}
		setEnhancedSaveOptions(options);
	};

	const updateEnhancedSave = (SaveType: string) => {
		const newEnhancedSaveOptions: EnhancedSaveOptions = enhancedSaveOptions;
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
		enhancedSaveNameBuilder();
	};

	const enhancedSaveNameBuilder = () => {
		let newAspectName = "Enhanced Save [";
		let saveTypes = "";
		let loopCount = 0;
		let numOfOptionsTrue = 0;
		// First check if there's only 1 option set to true, if so, return that option
		for (const [key, value] of Object.entries(enhancedSaveOptions)) {
			if (value) {
				numOfOptionsTrue++;
				if (loopCount === 0) {
					saveTypes += key;
					loopCount++;
					continue;
				}
				if (loopCount > 0) {
					saveTypes += "/" + key;
					loopCount++;
				}
			} else {
				if (loopCount === 0) {
					saveTypes = "";
				}
			}
		}
		if (saveTypes === "") {
			newAspectName = "Enhanced Save";
			setPreviewName(newAspectName);
			return;
		} else if (numOfOptionsTrue === 4) {
			newAspectName = "Enhanced Save [All]";
			setPreviewName(newAspectName);
			return;
		}
		newAspectName += saveTypes + "]";
		setPreviewName(newAspectName);
	};

	const updateEnhancedSaveNameFinal = () => {
		const aspectToAdd = {
			name: previewName,
			level: 0,
			maxLevel: 0,
		};
		const newEditedAspects = [...editedAspects, aspectToAdd];
		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
	};

	useEffect(() => {
		readEnhancedSaveOptions();
	}, []);
	return (
		<div
			className="fixed inset-0 bg-black/80 flex items-center justify-center z-70"
			onClick={onClose}
		>
			<div
				className="bg-dbu-bg2 border border-dbu-line rounded-lg w-full max-w-3xl mx-4 shadow-2xl overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-dbu-line">
					<h1 className="text-dbu-header font-semibold flex flex-wrap justify-center">
						Enhanced Save Aspect Editor
					</h1>
				</div>
				<div className="flex justify-center">
					<h3 className="italic">Enhanced Save Name Preview</h3>
				</div>
				<div className="flex justify-center">
					<h3>{previewName}</h3>
				</div>
				<div className="flex justify-center">
					<div className={buttonStateStyles.Impulsive}>
						<button
							className="p-5 text-md"
							onClick={() => updateEnhancedSave("Impulsive")}
						>
							Impulsive
						</button>
					</div>
					<div className={buttonStateStyles.Corporeal}>
						<button
							className="p-5 text-md"
							onClick={() => updateEnhancedSave("Corporeal")}
						>
							Corporeal
						</button>
					</div>
					<div className={buttonStateStyles.Cognitive}>
						<button
							className="p-5 text-md"
							onClick={() => updateEnhancedSave("Cognitive")}
						>
							Cognitive
						</button>
					</div>
					<div className={buttonStateStyles.Morale}>
						<button
							className="p-5 text-md"
							onClick={() => updateEnhancedSave("Morale")}
						>
							Morale
						</button>
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
							updateEnhancedSaveNameFinal();
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
