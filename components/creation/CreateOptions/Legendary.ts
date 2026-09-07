import {
	ATTR_MOD_DEFAULT,
	CreationForm,
	createData,
	createHead,
} from "./CreationObjects";

export default function createLegendary(
	name: string,
	author: string,
	authorID: number,
) {
	const legendary: CreationForm = {
		data: createData(name, "Legendary", author, authorID),
		head: createHead(name, {
			raceReq: "Any Race",
			preReq: "N/A",
			tier: "1",
			aspects: [],
			attributeModifiers: ATTR_MOD_DEFAULT,
			stressTest: "1",
			transformationType: "Form",
			formType: "Legendary",
			transLine: "...",
			transStage: "...",
		}),
		body: [],
	};

	return legendary;
}
