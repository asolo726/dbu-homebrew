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

function normalizeMiniTraitList(items) {
	return arrayify(items).map((item) => ({
		condition: item?.condition ?? item?.title ?? "",
		desc: item?.desc ?? "",
	}));
}

function normalizeAbility(ability) {
	if (!ability || typeof ability !== "object") return ability;
	const normalized = { ...ability };
	const legacyDepth = ability.sublist;
	if (normalized.listIndent === undefined && Number.isInteger(legacyDepth)) {
		normalized.listIndent = Math.max(0, Math.min(2, legacyDepth));
	}
	delete normalized.sublist;

	if (Array.isArray(ability.miniTraitList)) {
		normalized.miniTraitList = normalizeMiniTraitList(
			ability.miniTraitList,
		);
	}
	if (ability.addendumBox) {
		normalized.addendumBox = normalizeAddendumBox(ability.addendumBox);
	}
	return normalized;
}

function hasLegacyListDepth(value) {
	if (Array.isArray(value)) return value.some(hasLegacyListDepth);
	if (!value || typeof value !== "object") return false;
	if (Object.hasOwn(value, "sublist")) return true;
	return Object.values(value).some(hasLegacyListDepth);
}

function normalizeTrait(trait) {
	if (!trait || typeof trait !== "object") return trait;
	if (trait.sectional) {
		return { sectional: { title: trait.sectional.title ?? "" } };
	}
	return {
		...trait,
		title: trait.title ?? "",
		desc: trait.desc ?? "",
		abilities: arrayify(trait.abilities).map(normalizeAbility),
	};
}

function hasInitialBoxTrait(box) {
	return !!(
		box &&
		(box.title || box.desc || arrayify(box.abilities).length > 0)
	);
}

function makeSections(items, { splitSectionals = true } = {}) {
	const sections = [];
	let pendingHeader = "";
	let pendingTraits = [];

	function flush() {
		if (pendingTraits.length > 0) {
			sections.push({ header: pendingHeader, traits: pendingTraits });
		}
		pendingHeader = "";
		pendingTraits = [];
	}

	for (const rawItem of arrayify(items)) {
		const item = normalizeTrait(rawItem);
		if (splitSectionals && item?.sectional) {
			flush();
			pendingHeader = item.sectional.title ?? "";
			continue;
		}
		if (item != null) pendingTraits.push(item);
	}
	flush();
	return sections;
}

function normalizeAddendumBox(box) {
	if (!box || typeof box !== "object") return box;
	const items = [];
	if (hasInitialBoxTrait(box)) {
		items.push({
			title: box.title ?? "",
			desc: box.desc ?? "",
			abilities: arrayify(box.abilities).map(normalizeAbility),
		});
	}
	items.push(...arrayify(box.traits));
	return {
		boxTitle: box.boxTitle ?? "",
		body: makeSections(items),
	};
}

function makeDetails(doc, collectionName) {
	const oldHead = doc.head ?? {};
	const details = { ...(oldHead.details ?? {}) };

	for (const key of [
		"raceReq",
		"preReq",
		"stressTest",
		"stress",
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
	if (!details.attributeModifiers && Array.isArray(doc.attributeModifiers)) {
		details.attributeModifiers = doc.attributeModifiers;
	}

	const raceFeatures = doc.raceFeatures ?? oldHead.raceFeatures;
	if (!details.raceInfo && raceFeatures) {
		details.raceInfo = {
			RLM: Number(
				raceFeatures.racialLifeModifier ?? raceFeatures.RLM ?? 0,
			),
			saves: arrayify(raceFeatures.savingThrows),
			skillRanks: Number(raceFeatures.skillRanks ?? 0),
			attributeScores: raceFeatures.attributeScores ?? "",
			minionSize: raceFeatures.minionSize ?? "",
			availableFactors: raceFeatures.availableFactors ?? "",
		};
	}

	if (
		collectionName &&
		Object.keys(details).length === 0 &&
		collectionName !== "Other"
	) {
		details.collectionName = collectionName;
	}
	return details;
}

function makeBody(doc) {
	if (Array.isArray(doc.body)) {
		return doc.body.map((section) => ({
			...section,
			traits: arrayify(section?.traits).map(normalizeTrait),
		}));
	}
	const body = [];
	const addSection = (header, value) => {
		const sections = makeSections(value);
		if (sections.length > 0) {
			body.push(
				...sections.map((section) => ({
					...section,
					header: header || section.header,
				})),
			);
		}
	};

	addSection("Primary Traits", doc.primaryTraits);
	addSection("Secondary Traits", doc.secondaryTraits);
	addSection("Subraces", doc.subraces);
	addSection("Burst Limit", doc.burstLimit);
	addSection("Mastery Trait", doc.masteryTrait);
	addSection("Transcendent Trait", doc.transcendentTrait);
	addSection("Legendary Trait", doc.legendaryTrait);
	addSection("", doc.traits);
	return body;
}

function normalizeDocument(doc, collectionName, authorIds, toggleMap) {
	if (!doc || typeof doc !== "object") return null;

	const isAlreadyNormalized = !!(
		doc.data &&
		doc.head &&
		Array.isArray(doc.body)
	);
	if (
		isAlreadyNormalized &&
		doc.head.details &&
		typeof doc.head.details === "object" &&
		Object.keys(doc.head.details).length > 0 &&
		!hasLegacyListDepth(doc.body)
	) {
		return null;
	}

	const oldHead = doc.head ?? {};
	const author = doc.data?.author ?? oldHead.author ?? doc.author ?? "";
	const authorID =
		doc.data?.authorID ??
		oldHead.authorID ??
		doc.authorID ??
		(author ? authorIds.get(author) : undefined) ??
		"";
	const toggle =
		doc.data?.management?.toggle ?? oldHead.toggle ?? doc.toggle ?? "";
	const toggleOwner = author || oldHead.author || "";
	const toggleValue =
		toggleOwner && toggle
			? toggleMap.get(`${toggleOwner}:${toggle}`)
			: undefined;
	const data = {
		identity:
			doc.data?.identity ??
			oldHead.identity ??
			doc.identity ??
			collectionName ??
			"",
		keyName: doc.data?.keyName ?? oldHead.keyName ?? doc.keyName ?? "",
		author,
		authorID: authorID,
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
			status: toggleValue === false ? "Hidden" : "public",
			approved: true,
			isCommunity: !!(
				doc.data?.management?.isCommunity ??
				oldHead.isCommunity ??
				doc.isCommunity ??
				false
			),
			toggle,
		},
	};

	const details = makeDetails(doc, collectionName);
	const normalized = {
		_id: doc._id,
		data:
			doc.data && typeof doc.data === "object"
				? { ...doc.data, ...data }
				: data,
		head: {
			title: doc.data?.head?.title ?? oldHead.title ?? doc.title ?? "",
			banner:
				doc.data?.head?.banner ??
				oldHead.banner ??
				doc.banner ??
				DEFAULT_BANNER,
			desc: doc.data?.head?.desc ?? oldHead.desc ?? doc.desc ?? "",
		},
		body: makeBody(doc),
	};
	if (Object.keys(details).length > 0) normalized.head.details = details;
	if (Array.isArray(oldHead.communityAllowlist)) {
		normalized.head.communityAllowlist = oldHead.communityAllowlist;
	}
	if (oldHead.dontShowAuthor !== undefined) {
		normalized.head.dontShowAuthor = oldHead.dontShowAuthor;
	}

	if (oldHead.bannerAuthor && !normalized.data.credits.bannerAuthor) {
		normalized.data.credits.bannerAuthor = oldHead.bannerAuthor;
	}

	return normalized;
}

async function migrateCollection(client, collectionName, authorIds, toggleMap) {
	const coll = client.db(DB_NAME).collection(collectionName);
	const docs = await coll.find({}).toArray();
	let migrated = 0;
	let skipped = 0;

	for (const doc of docs) {
		const normalized = normalizeDocument(
			doc,
			collectionName,
			authorIds,
			toggleMap,
		);
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
		if (!normalized.head.details) {
			await coll.updateOne(
				{ _id: doc._id },
				{ $unset: { "head.details": "" } },
			);
		}

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
	const db = client.db(DB_NAME);
	const authorIds = new Map();
	for (const collectionName of COLLECTIONS) {
		const docs = await db.collection(collectionName).find({}).toArray();
		for (const doc of docs) {
			const author = doc.head?.author ?? doc.data?.author ?? doc.author;
			const authorID =
				doc.head?.authorID ?? doc.data?.authorID ?? doc.authorID;
			if (author && authorID !== undefined && authorID !== null) {
				authorIds.set(author, authorID);
			}
		}
	}

	const toggleMap = new Map();
	const toggleDoc = await client.db("Main").collection("toggles").findOne({});
	for (const [author, toggles] of Object.entries(toggleDoc?.toggles ?? {})) {
		for (const [toggle, value] of Object.entries(toggles ?? {})) {
			toggleMap.set(`${author}:${toggle}`, value);
		}
	}
	console.log(
		`Resolved ${authorIds.size} author IDs and ${toggleMap.size} toggle values`,
	);
	const results = [];

	for (const collectionName of COLLECTIONS) {
		try {
			const result = await migrateCollection(
				client,
				collectionName,
				authorIds,
				toggleMap,
			);
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
