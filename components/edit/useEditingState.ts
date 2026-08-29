import { useEditMode, type EditModeContextType } from "./EditModeContext";

// So Partials are pretty cool. What they do is allow you to define
// a type, but make every field optional. This omits the need to add a ?
// next to every field manually.
export function useEditingState(): Partial<EditModeContextType> {
	const ctx = useEditMode();
	return {
		isEditing: ctx?.isEditing ?? false,
		isContributing: ctx?.isContributing ?? false,
		contributorEmail: ctx?.contributorEmail ?? null,
		contributorName: ctx?.contributorName ?? null,
		isCommunity: ctx?.isCommunity ?? false,
		pendingChanges: ctx?.pendingChanges ?? {},
		setChange: ctx?.setChange,
		setArrayChange: ctx?.setArrayChange,
		hasChanges: ctx?.hasChanges ?? false,
	};
}
