const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

function loadMongoUri() {
	const envPath = path.join(__dirname, "..", ".env.local");
	if (!fs.existsSync(envPath))
		return process.env.MONGODB_URI || "mongodb://localhost:27017";

	const envText = fs.readFileSync(envPath, "utf8");
	const match = envText.match(/^MONGODB_URI\s*=\s*(.+)$/m);
	if (match && match[1]) {
		return match[1].replace(/^['"]|['"]$/g, "").trim();
	}

	return process.env.MONGODB_URI || "mongodb://localhost:27017";
}

const URI = loadMongoUri();
const DB_NAME = "content";
const COLLECTIONS = [
	"Alternate",
	"Legendary",
	"Enhancement",
	"Awakening",
	"Factor",
	"Race",
	"Races",
	"EvolvedStage",
	"Other",
];
const DEFAULT_BANNER =
	"https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp";

function arrayify(value) {
	return Array.isArray(value) ? value : [];
}

function makeDetails(doc, collectionName) {
	const oldHead = doc.head ?? {};
	const details = { ...(oldHead.details ?? {}) };

	for (const key of [
		"raceReq",
		"preReq",
		"stressTest",
		"tier",
		"aspects",
		"attributes",
		"attributeModifiers",
		"maxFactor",
		"maxStacks",
		"enhancementType",
		"initialEnhancement",
		"awakeningType",
		"awakeningOrigin",
		"evolvedStageType",
		"formType",
		"transformationType",
		"raceInfo",
		"transLine",
		"transStage",
		"researchLevel",
		"requiredRank",
		"lineage",
		"family",
	]) {
		if (oldHead[key] !== undefined) details[key] = oldHead[key];
		if (doc[key] !== undefined && details[key] === undefined)
			details[key] = doc[key];
	}

	if (!details.aspects && Array.isArray(doc.aspects))
		details.aspects = doc.aspects;
	if (!details.attributeModifiers && Array.isArray(doc.attributeModifiers))
		details.attributeModifiers = doc.attributeModifiers;
	if (
		!details.attributeModifiers &&
		Array.isArray(oldHead.attributeModifiers)
	)
		details.attributeModifiers = oldHead.attributeModifiers;

	if (!details.raceInfo && doc.raceFeatures) {
		const raceFeatures = doc.raceFeatures ?? {};
		const saves = Array.isArray(raceFeatures.savingThrows)
			? raceFeatures.savingThrows
			: [];
		details.raceInfo = {
			RLM: Number(
				raceFeatures.racialLifeModifier ?? raceFeatures.RLM ?? 0,
			),
			saves,
			skillRanks: Number(raceFeatures.skillRanks ?? 0),
			attributeScores: raceFeatures.attributeScores ?? "",
			minionSize: raceFeatures.minionSize ?? "",
			availableFactors: raceFeatures.availableFactors ?? "",
		};
	}

	if (!details.raceInfo && oldHead.raceFeatures) {
		const raceFeatures = oldHead.raceFeatures ?? {};
		const saves = Array.isArray(raceFeatures.savingThrows)
			? raceFeatures.savingThrows
			: [];
		details.raceInfo = {
			RLM: Number(
				raceFeatures.racialLifeModifier ?? raceFeatures.RLM ?? 0,
			),
			saves,
			skillRanks: Number(raceFeatures.skillRanks ?? 0),
			attributeScores: raceFeatures.attributeScores ?? "",
			minionSize: raceFeatures.minionSize ?? "",
			availableFactors: raceFeatures.availableFactors ?? "",
		};
	}

	if (oldHead.identity && !details.identity)
		details.identity = oldHead.identity;
	if (collectionName && !details.collectionName)
		details.collectionName = collectionName;

	return details;
}

function makeBody(doc) {
	if (Array.isArray(doc.body) && doc.body.length > 0) {
		return doc.body;
	}

	const body = [];

	const addSection = (header, value) => {
		const items = arrayify(value).filter(
			(entry) => entry !== null && entry !== undefined,
		);
		if (items.length > 0) body.push({ header, traits: items });
	};

	addSection("Primary Traits", doc.primaryTraits);
	addSection("Secondary Traits", doc.secondaryTraits);
	addSection("Subraces", doc.subraces);
	addSection("Burst Limit", doc.burstLimit);
	addSection("Mastery Trait", doc.masteryTrait);
	addSection("Legendary Trait", doc.legendaryTrait);
	addSection("Traits", doc.traits);

	if (Array.isArray(doc.head?.body)) {
		return doc.head.body;
	}

	if (body.length === 0 && Array.isArray(doc.traits)) {
		body.push({ header: "Traits", traits: doc.traits });
	}

	return body;
}

function normalizeDocument(doc, collectionName) {
	if (!doc || typeof doc !== "object") return null;

	const isAlreadyNormalized = !!(
		doc.data &&
		doc.head &&
		Array.isArray(doc.body)
	);
	if (
		isAlreadyNormalized &&
		doc.head.details &&
		typeof doc.head.details === "object"
	) {
		return null;
	}

	const oldHead = doc.head ?? {};
	const data = {
		identity:
			doc.data?.identity ??
			oldHead.identity ??
			doc.identity ??
			collectionName ??
			"",
		keyName: doc.data?.keyName ?? oldHead.keyName ?? doc.keyName ?? "",
		author: doc.data?.author ?? oldHead.author ?? doc.author ?? "",
		authorID: Number(
			doc.data?.authorID ?? oldHead.authorID ?? doc.authorID ?? 0,
		),
		tag: doc.data?.tag ?? doc.tag ?? "",
		credits: {
			bannerAuthor:
				doc.data?.credits?.bannerAuthor ??
				oldHead.bannerAuthor ??
				doc.bannerAuthor ??
				"",
			collabs:
				doc.data?.credits?.collabs ??
				oldHead.collabs ??
				doc.collabs ??
				"",
		},
		management: {
			status:
				doc.data?.management?.status ??
				oldHead.management?.status ??
				doc.management?.status ??
				"",
			approved: !!(
				doc.data?.management?.approved ??
				oldHead.management?.approved ??
				doc.management?.approved ??
				false
			),
			isCommunity: !!(
				doc.data?.management?.isCommunity ??
				oldHead.isCommunity ??
				doc.isCommunity ??
				false
			),
			toggle:
				doc.data?.management?.toggle ??
				oldHead.management?.toggle ??
				doc.management?.toggle ??
				"",
		},
	};

	const baseHead =
		doc.head && typeof doc.head === "object" ? { ...doc.head } : {};
	const normalized = {
		_id: doc._id,
		data:
			doc.data && typeof doc.data === "object"
				? { ...doc.data, ...data }
				: data,
		head: {
			...baseHead,
			title: doc.data?.head?.title ?? oldHead.title ?? doc.title ?? "",
			banner:
				doc.data?.head?.banner ??
				oldHead.banner ??
				doc.banner ??
				DEFAULT_BANNER,
			desc: doc.data?.head?.desc ?? oldHead.desc ?? doc.desc ?? "",
			details: makeDetails(doc, collectionName),
		},
		body: Array.isArray(doc.body) ? doc.body : makeBody(doc),
	};

	if (oldHead.bannerAuthor && !normalized.data.credits.bannerAuthor) {
		normalized.data.credits.bannerAuthor = oldHead.bannerAuthor;
	}

	return normalized;
}

async function migrateCollection(client, collectionName) {
	const coll = client.db(DB_NAME).collection(collectionName);
	const docs = await coll.find({}).toArray();
	let migrated = 0;
	let skipped = 0;

	for (const doc of docs) {
		const normalized = normalizeDocument(doc, collectionName);
		if (!normalized) {
			skipped += 1;
			continue;
		}

		const result = await coll.updateOne(
			{ _id: doc._id },
			{
				$set: {
					data: normalized.data,
					head: normalized.head,
					body: normalized.body,
				},
				$unset: {
					title: "",
					banner: "",
					desc: "",
					author: "",
					authorID: "",
					identity: "",
					keyName: "",
					bannerAuthor: "",
					collabs: "",
					isCommunity: "",
					dontShowAuthor: "",
					tag: "",
					primaryTraits: "",
					secondaryTraits: "",
					subraces: "",
					raceFeatures: "",
					traits: "",
					masteryTrait: "",
					legendaryTrait: "",
					burstLimit: "",
					aspects: "",
					attributeModifiers: "",
					attributes: "",
					management: "",
				},
			},
		);

		if (result.modifiedCount > 0 || result.matchedCount > 0) {
			migrated += 1;
		}
	}

	return { collectionName, migrated, skipped, total: docs.length };
}

async function main() {
	const client = new MongoClient(URI);
	await client.connect();

	console.log("Starting page migration for database:", DB_NAME);
	const results = [];

	for (const collectionName of COLLECTIONS) {
		try {
			const result = await migrateCollection(client, collectionName);
			results.push(result);
			console.log(JSON.stringify(result));
		} catch (error) {
			console.error("Failed for collection", collectionName, error);
			results.push({ collectionName, error: String(error) });
		}
	}

	await client.close();
	console.log("Migration complete");
	console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
	console.error("Migration script failed", error);
	process.exit(1);
});
