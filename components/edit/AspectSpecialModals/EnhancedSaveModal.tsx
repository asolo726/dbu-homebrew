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
	const [previewName, setPreviewName] = useState(EnhancedSaveName);
	const [buttonStateStyles, setButtonStateStyles] =
		useState<EnhancedSaveButtonStyles>({
			Impulsive:
				"text-dbu-header leading-none border border-text-dbu-header rounded-full",
			Corporeal:
				"text-dbu-header leading-none border border-text-dbu-header rounded-full",
			Cognitive:
				"text-dbu-header leading-none border border-text-dbu-header rounded-full",
			Morale: "text-dbu-header leading-none border border-text-dbu-header rounded-full",
		});

	const onClose = () => {
		setEnhancedWindowOpen(false);
	};

	const readEnhancedSaveOptions = () => {
		let options = {
			Impulsive: false,
			Corporeal: false,
			Cognitive: false,
			Morale: false,
		};
		let newButtonStyles = buttonStateStyles;

		if (EnhancedSaveName.includes("Impulsive")) {
			options.Impulsive = true;
			newButtonStyles.Impulsive =
				"text-dbu-bg1 leading-none border border-text-dbu-header rounded-full cursor-pointer bg-dbu-header";
		}
		if (EnhancedSaveName.includes("Corporeal")) {
			options.Corporeal = true;
			newButtonStyles.Corporeal =
				"text-dbu-bg1 leading-none border border-text-dbu-header rounded-full cursor-pointer bg-dbu-header";
		}
		if (EnhancedSaveName.includes("Cognitive")) {
			options.Cognitive = true;
			newButtonStyles.Cognitive =
				"text-dbu-bg1 leading-none border border-text-dbu-header rounded-full cursor-pointer bg-dbu-header";
		}
		if (EnhancedSaveName.includes("Morale")) {
			options.Morale = true;
			newButtonStyles.Morale =
				"text-dbu-bg1 leading-none border border-text-dbu-header rounded-full cursor-pointer bg-dbu-header";
		}

		setEnhancedSaveOptions(options);
		setButtonStateStyles(newButtonStyles);
	};

	const updateEnhancedSave = (SaveType: string) => {
		const newEnhancedSaveOptions: EnhancedSaveOptions = enhancedSaveOptions;
		enhancedSaveOptions[SaveType] = !enhancedSaveOptions[SaveType];
		// Updates Button Styles
		if (newEnhancedSaveOptions[SaveType]) {
			let newButtonStyles = buttonStateStyles;
			newButtonStyles[SaveType] = newButtonStyles[SaveType].concat(
				" bg-dbu-header",
			).replace("text-dbu-header", "text-dbu-bg1");
			setButtonStateStyles(newButtonStyles);
		} else {
			let newButtonStyles = buttonStateStyles;
			newButtonStyles[SaveType] = newButtonStyles[SaveType].replace(
				"text-dbu-bg1",
				"text-dbu-header",
			).replace("bg-dbu-header", "");
			setButtonStateStyles(newButtonStyles);
		}
		enhancedSaveNameBuilder();
	};

	const enhancedSaveNameBuilder = () => {
		let newAspectName = "Enhanced Save [";
		let saveTypes = "";
		let loopCount = 0;
		let numOfOptionsTrue = 0;
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
			name: "Enhanced Save",
			level: 0,
			EnhancedSaves: EnhancedSaveName,
		};
		const newEditedAspects = [...editedAspects, aspectToAdd];
		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
	};

	useEffect(() => {
		readEnhancedSaveOptions();
	}, []);

	useEffect(() => {
		setEnhancedSaveName(previewName);
	}, [previewName]);

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
					<h1 className="text-2xl text-dbu-header font-semibold flex flex-wrap justify-center">
						Enhanced Save Aspect Editor
					</h1>
				</div>
				<div className="flex justify-center">
					<h2 className="text-lg italic">
						Enhanced Save Name Preview
					</h2>
				</div>
				<div className="flex justify-center">
					<h3 className="text-xl font-semibold">{previewName}</h3>
				</div>
				<div className="flex flex-col md:justify-around mx-20 text-center md:flex-row md:flex-4 justify-center mb-4 mt-2">
					<div className={buttonStateStyles.Impulsive}>
						<button
							className="p-5 text-md cursor-pointer"
							onClick={() => updateEnhancedSave("Impulsive")}
						>
							Impulsive
						</button>
					</div>
					<div className={buttonStateStyles.Corporeal}>
						<button
							className="p-5 text-md cursor-pointer"
							onClick={() => updateEnhancedSave("Corporeal")}
						>
							Corporeal
						</button>
					</div>
					<div className={buttonStateStyles.Cognitive}>
						<button
							className="p-5 text-md cursor-pointer"
							onClick={() => updateEnhancedSave("Cognitive")}
						>
							Cognitive
						</button>
					</div>
					<div className={buttonStateStyles.Morale}>
						<button
							className="p-5 text-md cursor-pointer"
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
