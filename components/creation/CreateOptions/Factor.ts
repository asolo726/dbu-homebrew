import { CreationForm, createData, createHead } from "./CreationObjects";

export default function createFactor(
	name: string,
	author: string,
	authorID: number,
) {
	const factor: CreationForm = {
		data: createData(name, "Factor", author, authorID),
		head: createHead(name, {
			raceReq: "",
			maxFactor: "1",
			preReq: "",
		}),
		body: [{ header: "Traits", traits: [] }],
	};

	return factor;
}
