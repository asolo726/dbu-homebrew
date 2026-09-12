import clientPromise from "../../../lib/mongoDBClient";
import searchContent from "../searchContent/route.js";

/**
 * Aspect Shape:
 * title: String
 * isPositive: Boolean
 * effects: String
 * maxLevel: Number
 * isCustom: Boolean
 */

/**
 * Get Custom Aspects.
 */

async function getCustomAspects() {
	const aspectsPage = await searchContent("aspects");
	try {
		const body = aspectsPage.content?.[0]?.body;
		if (!Array.isArray(body)) return [];

		return body.flatMap((section) => {
			const header = section.header?.trim().toLowerCase();
			const isPositive = header === "positive aspects";
			const isNegative = header === "negative aspects";

			if (
				(!isPositive && !isNegative) ||
				!Array.isArray(section.traits)
			) {
				return [];
			}

			return section.traits.flatMap((trait) => {
				const effects = trait.abilities?.[0]?.desc || trait.desc;
				if (!trait.title || !effects) return [];

				return [
					{
						name: trait.title,
						isPositive,
						effects,
						maxLevel: 0,
						isCustom: true,
					},
				];
			});
		});
	} catch (error) {
		console.error("Error parsing custom aspects:", error);
		return [];
	}
}

/**
 * @param {*} session
 * Gets all Aspects from the Main.aspects cluster.
 * @returns On a Successful search, returns an Array with each Aspect as an entry.
 * @returns On a Failed search, returns a No Data Response
 */
export async function GET() {
	const client = await clientPromise;
	try {
		const db = client.db("Main");

		const data = await db
			.collection("aspects")
			.findOne({}, { projection: { _id: 0 } });
		const positiveAspects = data.positiveAspects.map((aspect) => {
			return {
				name: aspect.name,
				isPositive: true,
				effects: aspect.effects,
				maxLevel: aspect.maxLevel ? aspect.maxLevel : 0,
				isCustom: false,
			};
		});
		const negativeAspects = data.negativeAspects.map((aspect) => {
			return {
				name: aspect.name,
				isPositive: false,
				effects: aspect.effects,
				maxLevel: aspect.maxLevel ? aspect.maxLevel : 0,
				isCustom: false,
			};
		});

		const customAspects = await getCustomAspects();
		return Response.json({
			positiveAspects: positiveAspects,
			negativeAspects: negativeAspects,
			customAspects: customAspects,
		});
	} catch (e) {
		return { Response: "No Data Found" };
	}
}
