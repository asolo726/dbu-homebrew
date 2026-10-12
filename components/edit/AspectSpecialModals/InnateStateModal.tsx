"use client";
import { link } from "fs";
import { useState, useEffect } from "react";

interface InnateStateModalProps {
	setInnateStateWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
	editedAspects: any;
	setEditedAspects: React.Dispatch<React.SetStateAction<any>>;
	updatingAspect: boolean;
	setUpdatingAspect: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InnateStateModal({
	setInnateStateWindowOpen,
	editedAspects,
	setEditedAspects,
	updatingAspect,
	setUpdatingAspect,
}: InnateStateModalProps) {
	const onClose = () => {
		setInnateStateWindowOpen(false);
	};

	const addInnateStateFinal = (
		innateState: string,
		innateStateURL?: string,
		innateStateLevel?: number,
	) => {
		const aspectToAdd = {
			name: "Innate State",
			level: innateStateLevel || 0,
			innateState: `Innate State (${innateState})`,
			link: {
				name: innateState,
				url: innateStateURL || "",
			},
		};
	};
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
						Innate State Aspect Editor
					</h1>
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
							// Add the add aspect function here...
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
