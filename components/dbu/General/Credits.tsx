"use client";
import EditableText from "@/components/edit/EditableText";
import type { Data } from "./Head";
import { useEditingState } from "@/components/edit/useEditingState";
import { useEffect, useRef, useState } from "react";

const dragonGraveSrc = "/audio/dragonGrave.mp3";
const nothingChangedSrc = "/audio/nothingChanged.mp3";

export default function Credits({ Data }: Readonly<{ Data: Data }>) {
	const { isEditing, contributorName, pendingChanges, setChange } =
		useEditingState();
	const [showAuthorWarning, setShowAuthorWarning] = useState(false);
	const authorWarningShown = useRef(false);
	const pendingAuthor = pendingChanges?.["data.author"];

	useEffect(() => {
		const authorChanged =
			typeof pendingAuthor === "string" &&
			pendingAuthor.trim() !== Data.author;
		const isCurrentAuthor = contributorName === Data.author;

		if (!isEditing) {
			authorWarningShown.current = false;
		} else if (
			authorChanged &&
			isCurrentAuthor &&
			!authorWarningShown.current
		) {
			authorWarningShown.current = true;
			setShowAuthorWarning(true);
			setWeirdRoute(Math.random() * 15 + 1 > 14); // 1 in 15 chance of a weird route
		}
	}, [Data.author, contributorName, isEditing, pendingAuthor]);

	function cancelAuthorChange() {
		setChange?.("data.author", Data.author);
		setShowAuthorWarning(false);
		authorWarningShown.current = false;
	}
	const [weirdRoute, setWeirdRoute] = useState(false);

	function playAudio(source: string) {
		const audio = new Audio(source);
		void audio.play();
	}

	return (
		<>
			<div className="w-full mt-12 border-t border-gray-700 pt-8" />
			<div className="bg-dbu-bg2 text-xl italic">
				<h2 className="text-2xl font-bold text-gray-200 mb-6">
					Credits
				</h2>
				<p>
					<span className="font-bold text-dbu-header">Author: </span>
					<EditableText path={`data.author`} value={Data.author} />
				</p>
				<p>
					<span className="font-bold text-dbu-header">
						Art Credit:{" "}
					</span>
					<EditableText
						path={`data.credits.bannerAuthor`}
						value={Data.credits.bannerAuthor}
					/>
				</p>
				{/** We want this visible if the user is editing or if there are collaborators */}
				{(isEditing || Data.credits.collabs !== "") && (
					<p>
						<span className="font-bold text-dbu-header">
							Collaborators:{" "}
						</span>
						<EditableText
							path={`data.credits.collabs`}
							value={Data.credits.collabs}
						/>
					</p>
				)}
				{(isEditing || Data.tag !== "") && (
					<p>
						<span className="font-bold text-dbu-header">Tag: </span>
						<EditableText path={`data.tag`} value={Data.tag} />
					</p>
				)}
			</div>
			{showAuthorWarning && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
					<div className="bg-dbu-bg2 border border-dbu-line rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
						<h2 className="text-dbu-header text-lg font-semibold mb-3">
							Change page author?
						</h2>
						<p className="text-dbu-text text-sm mb-6">
							Hello my friend! It seems you're trying to change
							the author of this page. Now, that's all fine and
							dandy, if you want to transfer ownership to someone
							else, but if not, you probably don't wanna edit
							this.
						</p>
						<div className="flex gap-3 justify-end">
							{}
							<button
								type="button"
								onClick={() => {
									cancelAuthorChange();
									if (weirdRoute)
										playAudio(nothingChangedSrc);
								}}
								className="px-4 py-2 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setShowAuthorWarning(false);
									if (weirdRoute) playAudio(dragonGraveSrc);
								}}
								className={`px-4 py-2 rounded-md text-sm text-white ${weirdRoute ? "bg-red-900 hover:bg-red-900/90" : "bg-dbu-link hover:bg-dbu-link/90"} transition-colors`}
							>
								{weirdRoute ? "Proceed" : "Continue"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
