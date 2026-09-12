const { MongoClient } = require("mongodb");

async function main() {
	const client = new MongoClient("mongodb://localhost:27017");
	await client.connect();
	const db = client.db("content");
	const names = [
		"Alternate",
		"Legendary",
		"Enhancement",
		"Awakening",
		"Factor",
		"Race",
		"Races",
		"EvolvedStage",
	];

	for (const name of names) {
		const coll = db.collection(name);
		const count = await coll.countDocuments();
		const sample = await coll.findOne({});
		console.log("\n=== " + name + " (count=" + count + ") ===");
		if (!sample) {
			console.log("NO_DOCUMENTS");
			continue;
		}
		console.log("TOP_LEVEL_KEYS", Object.keys(sample));
		if (sample.data) console.log("DATA_KEYS", Object.keys(sample.data));
		if (sample.head) console.log("HEAD_KEYS", Object.keys(sample.head));
		if (sample.body)
			console.log(
				"BODY_LEN",
				Array.isArray(sample.body)
					? sample.body.length
					: typeof sample.body,
			);
		console.log("SAMPLE", JSON.stringify(sample, null, 2).slice(0, 2500));
	}

	await client.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
