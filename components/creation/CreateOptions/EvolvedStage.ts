import {
	ATTR_MOD_DEFAULT,
	CreationForm,
	createData,
	createHead,
} from "./CreationObjects";

export default function createEvolvedStage(
	name: string,
	author: string,
	authorID: number,
) {
	const evolvedStage: CreationForm = {
		data: createData(name, "Evolved Stage", author, authorID),
		head: createHead(name, {
			preReq: "N/A",
			tier: "1",
			aspects: [],
			attributeModifiers: ATTR_MOD_DEFAULT,
			transformationType: "Form",
			stressTest: "1",
			evolvedStageType: "Generic",
			formType: "Same as Original Form",
		}),
		body: [],
	};

	return evolvedStage;
}
