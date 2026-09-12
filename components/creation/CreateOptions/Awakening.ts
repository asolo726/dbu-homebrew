import {
	ATTR_MOD_DEFAULT_AWAKENING,
	CreationForm,
	createData,
	createHead,
} from "./CreationObjects";
function createAwakening(name: string, author: string, authorID: number) {
	const awakening: CreationForm = {
		data: createData(name, "Awakening", author, authorID),
		head: createHead(name, {
			raceReq: "",
			preReq: "",
			tier: "",
			aspects: [],
			attributeModifiers: ATTR_MOD_DEFAULT_AWAKENING,
			maxStacks: 1,
			transformationType: "Awakening",
			awakeningType: "",
			awakeningOrigin: "",
		}),
		body: [],
	};

	return awakening;
}

export default createAwakening;
