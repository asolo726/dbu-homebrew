import {
	ATTR_MOD_DEFAULT,
	CreationForm,
	createData,
	createHead,
} from "./CreationObjects";

export default function createAlternate(
	name: string,
	author: string,
	authorID: number,
) {
	const alternate: CreationForm = {
		data: createData(name, "Alternate", author, authorID),
		head: createHead(name, {
			raceReq: "Any Race",
			preReq: "N/A",
			tier: "1",
			aspects: [],
			attributeModifiers: ATTR_MOD_DEFAULT,
			stressTest: "1",
			transLine: "",
			transStage: "",
			transformationType: "Form",
			formType: "Alternate",
		}),
		body: [],
	};

	return alternate;
}
