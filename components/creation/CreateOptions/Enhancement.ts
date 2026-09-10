import {
	ATTR_MOD_DEFAULT,
	CreationForm,
	createData,
	createHead,
} from "./CreationObjects";

export default function createEnhancement(
	name: string,
	author: string,
	authorID: number,
) {
	const enhancement: CreationForm = {
		data: createData(name, "Enhancement", author, authorID),
		head: createHead(name, {
			raceReq: "Any Race",
			preReq: "N/A",
			tier: "1",
			aspects: [],
			attributeModifiers: ATTR_MOD_DEFAULT,
			transformationType: "Enhancement",
			enhancementType: "Standard",
			initialEnhancement: undefined,
			stressTest: "1",
		}),
		body: [],
	};

	return enhancement;
}
