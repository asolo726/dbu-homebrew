export interface BodySection {
	header: string;
	headerSize?: "h2" | "h3" | "h4";
	traits: unknown[];
}

export interface CreationForm {
	data: {
		identity: string;
		keyName: string;
		author: string;
		authorID: number;
		tag: string;
		credits: {
			bannerAuthor: string;
			collabs: string;
		};
		management: {
			status: string;
			approved: boolean;
			isCommunity: boolean;
			toggle: string;
		};
	};
	head: {
		title: string;
		banner: string;
		desc: string;
		details: Record<string, unknown>;
	};
	body: BodySection[];
}

const DEFAULT_BANNER =
	"https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp";

export function createData(
	name: string,
	identity: string,
	author: string,
	authorID: number,
) {
	return {
		identity,
		keyName: name.replaceAll(" ", "-").toLowerCase(),
		author,
		authorID,
		tag: "",
		credits: {
			bannerAuthor: "",
			collabs: "",
		},
		management: {
			status: "",
			approved: false,
			isCommunity: false,
			toggle: "",
		},
	};
}

export function createHead(title: string, details: Record<string, unknown>) {
	return {
		title,
		banner: DEFAULT_BANNER,
		desc: "",
		details,
	};
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
