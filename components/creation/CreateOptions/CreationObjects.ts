export interface BasicHead {
	title: string;
	author: string;
	authorID: number;
	banner?: string;
	bannerAuthor?: string;
	keyName: string;
	identity: string;
	dontShowAuthor: boolean;
	tag: string;
	// This is what allows us to add more keys to the Object
	[key: string]: string | number | boolean | undefined | {} | [];
}

export const ATTR_MOD_DEFAULT = [
	{ attribute: "AG", Bonus: 0, Multiplier: "T" },
	{ attribute: "FO", Bonus: 0, Multiplier: "T" },
	{ attribute: "TE", Bonus: 0, Multiplier: "T" },
	{ attribute: "SC", Bonus: 0, Multiplier: "T" },
	{ attribute: "IN", Bonus: 0, Multiplier: "T" },
	{ attribute: "MA", Bonus: 0, Multiplier: "T" },
	{ attribute: "PE", Bonus: 0, Multiplier: "T" },
];

// Awakenings, outside of Super Awakenings, don't have T multipliers.
export const ATTR_MOD_DEFAULT_AWAKENING = [
	{ attribute: "AG", Bonus: 0, Multiplier: "" },
	{ attribute: "FO", Bonus: 0, Multiplier: "" },
	{ attribute: "TE", Bonus: 0, Multiplier: "" },
	{ attribute: "SC", Bonus: 0, Multiplier: "" },
	{ attribute: "IN", Bonus: 0, Multiplier: "" },
	{ attribute: "MA", Bonus: 0, Multiplier: "" },
	{ attribute: "PE", Bonus: 0, Multiplier: "" },
];
