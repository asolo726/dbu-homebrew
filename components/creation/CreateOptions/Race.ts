import { CreationForm, createData, createHead } from "./CreationObjects";

function createRace(name: string, author: string, authorID: number) {
	const race: CreationForm = {
		data: createData(name, "Race", author, authorID),
		head: createHead(name, {
			raceInfo: {
				RLM: 0,
				saves: [""],
				skillRanks: 0,
				attributeScores: "",
			},
		}),
		body: [
			{ header: "Primary Traits", traits: [] },
			{ header: "Secondary Traits", traits: [] },
			{ header: "Subraces", traits: [] },
		],
	};

	return race;
}

export default createRace;
