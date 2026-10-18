"use client";
import { useState, useEffect } from "react";
import { Tooltip } from "../../../lib/reactTooltip.js";
import {
	getInnateStateTooltip,
	InnateState,
	loadInnateStateOptions,
} from "../util/innateStateTooltips";

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

	const [innateStateOptions, setInnateStateOptions] = useState([]);
	const [innateState, setInnateState] = useState([""]);
	const [selectedInnateStates, setSelectedInnateStates] = useState([]);

	useEffect(() => {
		const fetchInnateStates = async () => {
			const data = await loadInnateStateOptions();
			setInnateStateOptions(data);
		};
		fetchInnateStates();
	}, []);

	const addSelectedInnateState = (innateStateName: string) => {
		if (innateState[0] === "") {
			setInnateState([innateStateName]);
		} else if (innateState.includes(innateStateName)) {
			removeSelectedInnateState(innateStateName);
		} else {
			setInnateState([...innateState, innateStateName]);
		}
	};

	const removeSelectedInnateState = (innateStateName: string) => {
		setInnateState(
			innateState.filter(
				(innateState) => innateState !== innateStateName,
			),
		);
	};

	const addInnateStateFinal = () => {
		const innateStateFinal = innateState.join("/");
		let aspectToAdd: any = {
			name: "Innate State",
			level: 0,
			innateState: `(${innateStateFinal})`,
		};

		const newEditedAspects = [...editedAspects, aspectToAdd];
		setUpdatingAspect(!updatingAspect);
		setEditedAspects(newEditedAspects);
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
				{/* Body */}
				<div className="flex justify-center">
					<h2 className="text-sm italic">Selected Innate States</h2>
				</div>
				<div className="flex justify-center">
					<span className="text-xl font-semibold">
						{innateState.join("/")}
					</span>
				</div>
				<div className="px-6 py-4">
					<div className="flex flex-wrap justify-center gap-2">
						{innateStateOptions.map((innateState: InnateState) => (
							<span
								key={innateState.name}
								className="px-4 py-2 rounded border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
								data-tooltip-id="my-tooltip-3"
								data-tooltip-html={getInnateStateTooltip(
									innateState.name,
								)}
							>
								<button
									onClick={() =>
										addSelectedInnateState(innateState.name)
									}
								>
									{innateState.name}
								</button>
							</span>
						))}
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
							addInnateStateFinal();
							onClose();
						}}
					>
						Save
					</button>
				</div>
			</div>
			<Tooltip
				id="my-tooltip-3"
				className="tooltip z-30"
				style={{ maxWidth: "500px" }}
			/>
		</div>
	);
}
