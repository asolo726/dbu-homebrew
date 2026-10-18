import { Interface } from "readline";

export let innateStateOptions: InnateState[] = [];
let innateStateOptionsLoaded = false;
let innateStateOptionsPromise: any = null;

interface Level {
	levelName: string;
	abilities: Ability[];
}
interface Ability {
	condition: string;
	desc: string;
}
export interface InnateState {
	name: string;
	narrativeReq?: string;
	hasLevels: boolean;
	levels?: Level[];
	abilities?: Ability[];
}

export async function loadInnateStateOptions() {
	if (innateStateOptionsLoaded) return innateStateOptionsPromise;

	innateStateOptionsPromise = fetch("/api/getInnateStates")
		.then((res) => res.json())
		.then((data) => {
			if (data.Response === "Success") return data.innateStatesArr;
		});
	innateStateOptions = await innateStateOptionsPromise;
	innateStateOptionsLoaded = true;

	return innateStateOptionsPromise;
}

export const getInnateStateTooltip = (innateStateName: string) => {
	const innateState: InnateState | undefined = innateStateOptions.find(
		(innateState: InnateState) => innateState.name === innateStateName,
	);
	if (innateState === undefined) return "Failed to get innate state tooltip";
	return innateStateTooltipStringBuilder(innateState);
};

const innateStateTooltipStringBuilder = (
	innateState: InnateState | undefined,
) => {
	let toolTipString = `
    <div class="p-3">
        <div class="text-lg font-bold text-dbu-header">${innateState?.name}</div>`;
	if (innateState?.narrativeReq) {
		toolTipString += `<div class="italic text-sm mb-2 text-white-100">${innateState.narrativeReq}</div>`;
	}
	if (innateState?.hasLevels) {
		let levelCount = 1;
		innateState?.levels?.forEach((level) => {
			toolTipString += `<div class="mt-2 text-sm font-bold leading-relaxed text-dbu-header">${level.levelName} (Level ${levelCount}): </div>`;
			levelCount++;
			let abilityCount = 1;
			level.abilities?.forEach((ability) => {
				toolTipString += abilityBuilder(ability, abilityCount);
				abilityCount++;
			});
		});
	} else {
		let abilityCount = 1;
		innateState?.abilities?.forEach((ability) => {
			toolTipString += abilityBuilder(ability, abilityCount);
			abilityCount++;
		});
	}
	// Outer Div
	toolTipString += `</div>`;
	return toolTipString;
};

const abilityBuilder = (ability: Ability, count: number) => {
	return `<div class="text-sm leading-relaxed text-white-100">
                (<span class="font-bold text-dbu-header">${count++}</span>)-[<span class="font-bold text-dbu-header">${ability.condition}</span>]: ${ability.desc}</div>`;
};
