export type BoxTemplates =
	| "Signature Technique"
	| "Signature Advantage"
	| "Unique Ability"
	| "Maneuver"
	| "Battle Uniform"
	| "Battle Weather"
	| "State"
	| "Environment"
	| "Profile";

export const boxTemplates: Record<BoxTemplates, Readonly<any>> = {
	"Signature Technique": {
		body: [
			{
				header: "(Signature Name)",
				traits: [
					{
						title: "",
						desc: "",
						abilities: [
							{
								miniTraitList: [
									{
										condition: "Foundation",
										desc: "<Foundation> (Profile)",
									},
									{
										condition: "Advantages",
										desc: "...",
									},
									{
										condition: "Disadvantages",
										desc: "...",
									},
									{
										condition: "Ki Point Cost",
										desc: "X(T)",
									},
								],
							},
						],
					},
				],
			},
		],
	},
	"Signature Advantage": {
		body: [
			{
				header: "",
				traits: [
					{
						title: "(Signature Name)",
						desc: "...",
						abilities: [
							{
								condition: "–TP Cost",
								desc: "XX",
							},
							{
								condition: "–Requirement",
								desc: "...",
							},
							{
								condition: "–Effect",
								desc: "...",
							},
						],
					},
				],
			},
		],
	},
	"Unique Ability": {
		body: [
			{
				header: "(Unique Ability Name)",
				traits: [
					{
						title: "",
						desc: "...",
						abilities: [
							{
								condition: "–Ability Type",
								desc: "Technical, Magical, Technical/Magical",
							},
							{
								condition: "–Prerequisites",
								desc: "...",
							},
							{
								condition: "–TP Cost",
								desc: "X",
							},
							{
								condition: "–KP Cost",
								desc: "X(T)",
							},
							{
								condition: "–Maneuver Type",
								desc: "X",
							},
							{
								condition: "–Minions",
								desc: "X",
							},
							{
								condition: "–Passive Bonus",
								desc: "...",
							},
							{
								condition: "–Effect",
								desc: "...",
							},
						],
					},
				],
			},
		],
	},
	Maneuver: {
		body: [
			{
				header: "",
				traits: [
					{
						title: "Maneuver Name [X/X]",
						desc: "...",
						abilities: [
							{
								condition: "–Maneuver Type",
								desc: "X Maneuver",
							},
							{
								condition: "–Action Cost",
								desc: "X Action(s)",
							},
							{
								condition: "–KP Cost",
								desc: "X(T)",
							},
							{
								condition: "–Exploitable",
								desc: "...",
							},
							{
								condition: "–Effect",
								desc: "...",
							},
						],
					},
				],
			},
		],
	},
	"Battle Uniform": {
		body: [
			{
				header: "",
				traits: [
					{
						title: "Category",
						desc: "Standard Clothing, Combat Clothing, Armor, Weights",
						abilities: [],
					},
					{
						title: "Craftsmanship Grade",
						desc: "X",
						abilities: [],
					},
					{
						title: "Accessories",
						desc: "X",
						abilities: [],
					},
					{
						title: "(Quality Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Apparel Category",
								desc: "X",
							},
							{
								condition: "–Prerequisites",
								desc: "X",
							},
							{
								condition: "–Quality Slots",
								desc: "X",
							},
							{
								condition: "–Effects",
								desc: "...",
							},
						],
					},
					{
						title: "(Quality Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Apparel Category",
								desc: "X",
							},
							{
								condition: "–Prerequisites",
								desc: "X",
							},
							{
								condition: "–Quality Slots",
								desc: "X",
							},
							{
								condition: "–Effects",
								desc: "...",
							},
						],
					},
					{
						title: "(Quality Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Apparel Category",
								desc: "X",
							},
							{
								condition: "–Prerequisites",
								desc: "X",
							},
							{
								condition: "–Quality Slots",
								desc: "X",
							},
							{
								condition: "–Effects",
								desc: "...",
							},
						],
					},
					{
						title: "(Quality Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Apparel Category",
								desc: "X",
							},
							{
								condition: "–Prerequisites",
								desc: "X",
							},
							{
								condition: "–Quality Slots",
								desc: "X",
							},
							{
								condition: "–Effects",
								desc: "...",
							},
						],
					},
					{
						title: "(Quality Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Apparel Category",
								desc: "X",
							},
							{
								condition: "–Prerequisites",
								desc: "X",
							},
							{
								condition: "–Quality Slots",
								desc: "X",
							},
							{
								condition: "–Effects",
								desc: "...",
							},
						],
					},
				],
			},
		],
	},
	"Battle Weather": {
		body: [
			{
				header: "",
				traits: [
					{
						title: "(Weather Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Connected Profile",
								desc: "Elemental (X)",
							},
							{
								condition: "–Natural Weather (Tier 1) Effects",
								desc: "",
							},
							{
								list: ["...", "...", "..."],
							},
							{
								condition:
									"–Unnatural Weather (Tier 2) Effect(s)",
								desc: "",
							},
							{
								list: ["...", "...", "..."],
							},
							{
								condition:
									"–Cataclysmic Weather (Tier 3) Effect(s)",
								desc: "",
							},
							{
								list: ["...", "...", "..."],
							},
						],
					},
				],
			},
		],
	},
	State: {
		body: [
			{
				header: "(State Name)",
				traits: [
					{
						title: "...",
						desc: "...",
						abilities: [
							{
								condition: "...",
								desc: "...",
							},
						],
					},
				],
			},
		],
	},
	Environment: {
		body: [
			{
				header: "",
				traits: [
					{
						title: "(Environment Name)",
						desc: "...",
						abilities: [
							{
								condition: "–Hardness Rank",
								desc: "N/A",
							},
							{
								condition: "–Effects",
								desc: "N/A",
							},
							{
								list: [
									"...",
									"...",
									"...",
									"...",
									"...",
									"...",
								],
							},
						],
					},
				],
			},
		],
	},
	Profile: {
		body: [
			{
				header: "(State Name)",
				traits: [
					{
						title: "(Profile)",
						desc: "...",
						abilities: [
							{
								condition: "–Foundations",
								desc: "X",
							},
							{
								condition: "–Damage Category",
								desc: "X",
							},
							{
								condition: "–KP Cost",
								desc: "X(T)",
							},
							{
								condition: "–Effect",
								desc: "X",
							},
						],
					},
				],
			},
		],
	},
};

export function createBoxTemplate(template: BoxTemplates): Readonly<any> {
	return boxTemplates[template];
}
