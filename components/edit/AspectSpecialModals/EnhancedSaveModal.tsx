"use client";
import { useState, useEffect } from "react";

interface EnhancedSaveModalProps {
    EnhancedSaveName: string;
    setEnhancedSaveName: React.Dispatch<React.SetStateAction<string>>;
}

export default function EnhancedSaveModal({EnhancedSaveName, setEnhancedSaveName}: EnhancedSaveModalProps) {
	// const [enhancedSaveOptions, setEnhancedSaveOptions] = useState(
	// 	{ Impulsive: false },
	// 	{ Corporeal: false },
	// 	{ Cognitive: false },
	// 	{ Morale: false },
	// );
    // const readEnhancedSaveOptions = () => {
		// 	let options = {
		// 		Impulsive: false,
		// 		Corporeal: false,
		// 		Cognitive: false,
		// 		Morale: false,
		// 	};
		// 	if (a.name.includes("Impulsive")) {
		// 		options.Impulsive = true;
		// 	}
		// 	if (a.name.includes("Corporeal")) {
		// 		options.Corporeal = true;
		// 	}
		// 	if (a.name.includes("Cognitive")) {
		// 		options.Cognitive = true;
		// 	}
		// 	if (a.name.includes("Morale")) {
		// 		options.Morale = true;
		// 	}
		// 	return options;
		// }
    
    return (
		<div
			className="fixed inset-0 bg-black/80 flex items-center justify-center z-70"
			// onClick={}
		>
			<div
				className="bg-dbu-bg2 border border-dbu-line rounded-lg w-full max-w-3xl mx-4 shadow-2xl overflow-hidden"
				// onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-dbu-line">
					<h1 className="text-dbu-header font-semibold flex flex-wrap justify-center">
						Enhanced Save Aspect Editor
					</h1>
				</div>
                <div>
                    <p>
                        filler text
                    </p>
                </div>
			</div>
		</div>
	);
}
