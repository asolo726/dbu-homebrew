"use client";
import { useEditMode } from "../../edit/EditModeContext";

export default function CommunitySettings({
	keyName,
	isCommunity: initialIsCommunity,
}) {
	const ctx = useEditMode();
	const { isEditing, isAdmin, pendingChanges, setChange } = ctx || {};

	if (!isEditing) return null;

	const currentIsCommunity =
		pendingChanges?.["data.management.isCommunity"] ??
		initialIsCommunity ??
		false;

	return (
		<CommunitySettingsPanel
			keyName={keyName}
			currentIsCommunity={currentIsCommunity}
			isAdmin={isAdmin}
			setChange={setChange}
		/>
	);
}

// Separate inner component so hooks aren't conditional
function CommunitySettingsPanel({ currentIsCommunity, isAdmin, setChange }) {
	return (
		<div className="border border-blue-400/40 rounded-xl p-4 bg-blue-950/20">
			<div className="flex items-center justify-between mb-3">
				<h4 className="text-blue-300 font-semibold tracking-wide text-sm uppercase">
					Community Settings
				</h4>
				{isAdmin && (
					<button
						onClick={() =>
							setChange?.(
								"data.management.isCommunity",
								!currentIsCommunity,
							)
						}
						className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
							currentIsCommunity
								? "border-blue-400 text-blue-300 bg-blue-900/30 hover:bg-red-900/20 hover:text-red-300 hover:border-red-400"
								: "border-dbu-line text-dbu-text/60 hover:border-blue-400 hover:text-blue-300"
						}`}
					>
						{currentIsCommunity
							? "Disable Community"
							: "Enable Community"}
					</button>
				)}
			</div>
		</div>
	);
}
