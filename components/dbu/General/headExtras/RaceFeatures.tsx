import EditableText from "../../../edit/EditableText";
import { useEditingState } from "../../../edit/useEditingState";

const SAVING_THROW_OPTIONS = ["Impulsive", "Corporeal", "Cognitive", "Morale"];

export default function RaceFeatures({
	racialLifeModifier = 0,
	savingThrows = [""],
	skillRanks = 0,
	attributeScores = "",
	minionSize = "",
	availableFactors = "",
	isEditing = false,
}) {
	const { pendingChanges, setChange } = useEditingState();
	const savingThrowsPath = "head.details.raceInfo.saves";
	const currentSavingThrows: string[] = Array.isArray(
		pendingChanges?.[savingThrowsPath],
	)
		? pendingChanges[savingThrowsPath]
		: savingThrows;

	function toggleSavingThrow(name: string) {
		if (!setChange) return;
		const nextSavingThrows = currentSavingThrows.includes(name)
			? currentSavingThrows.filter((savingThrow) => savingThrow !== name)
			: [...currentSavingThrows.filter(Boolean), name];
		setChange(savingThrowsPath, nextSavingThrows);
	}

	const savingThrowsDisplay =
		currentSavingThrows.length === 1
			? currentSavingThrows[0]
			: currentSavingThrows.length === 0
				? ""
				: currentSavingThrows.slice(0, -1).join(", ") +
					(currentSavingThrows.length > 1 ? " and " : "") +
					currentSavingThrows.at(-1);
	const hasMinionSize =
		minionSize != null && minionSize != undefined && minionSize != "";
	const hasAvailableFactors =
		availableFactors != null &&
		availableFactors != undefined &&
		availableFactors != "";
	const requirementNameStyle = "font-bold text-dbu-header";
	return (
		<div className="border border-dbu-header space-y-6 p-2">
			<p>
				<span className={requirementNameStyle}>
					Attribute Score Increase:
				</span>{" "}
				<EditableText
					path="head.details.raceInfo.attributeScores"
					value={String(attributeScores)}
				/>
			</p>
			<p>
				<span className={requirementNameStyle}>
					Racial Life Modifier:
				</span>{" "}
				+
				<EditableText
					path="head.details.raceInfo.RLM"
					value={String(racialLifeModifier)}
				/>
			</p>
			<p>
				<span className={requirementNameStyle}>Saving Throws:</span>{" "}
				{isEditing ? (
					<span className="flex flex-col gap-1 mt-2 not-italic">
						{SAVING_THROW_OPTIONS.map((savingThrow) => (
							<label
								key={savingThrow}
								className="flex items-center justify-between gap-4 font-normal"
							>
								<span>{savingThrow}</span>
								<input
									type="checkbox"
									checked={currentSavingThrows.includes(
										savingThrow,
									)}
									onChange={() =>
										toggleSavingThrow(savingThrow)
									}
									className="h-4 w-4 cursor-pointer"
								/>
							</label>
						))}
					</span>
				) : (
					<span className="italic">{savingThrowsDisplay}</span>
				)}
			</p>
			<p>
				<span className={requirementNameStyle}>Skill Ranks:</span>{" "}
				<EditableText
					path="head.details.raceInfo.skillRanks"
					value={String(skillRanks)}
				/>
			</p>
			{hasMinionSize || isEditing ? (
				<p>
					<span className={requirementNameStyle}>Minion Size:</span>{" "}
					<EditableText
						path="head.details.raceInfo.minionSize"
						value={String(minionSize)}
					/>
				</p>
			) : (
				<></>
			)}
			{hasAvailableFactors || isEditing ? (
				<p>
					<span className={requirementNameStyle}>
						Available Factors:
					</span>{" "}
					<EditableText
						path="head.details.raceInfo.availableFactors"
						value={String(availableFactors)}
					/>
				</p>
			) : (
				<></>
			)}
		</div>
	);
}
