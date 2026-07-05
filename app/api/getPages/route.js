import clientPromise from "../../../lib/mongoDBClient";

/**
 *
 * @param {*} session
 * Gets all entries from each collection in the content Cluster.
 * @returns On a Successful search, returns an object with each entry with the collection as its key.
 * @returns On a Failed search, returns a No Data Response
 */
export default async function GET() {
  const client = await clientPromise;
  const db = client.db("content");

  const collections = await db.listCollections({}, { nameOnly: true });
  const result = {};

  try {
    // Fetch all statistics in one query and build a keyName → stats map
    const statsArr = await client
      .db("Main")
      .collection("statistics")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const statsMap = Object.fromEntries(statsArr.map((s) => [s.keyName, s]));

    for await (const collection of collections) {
      const entries = await db
        .collection(collection.name)
        .find({}, { projection: { _id: 0 } })
        .toArray();

      result[collection.name] = entries.map((entry) => {
        const stats = statsMap[entry.head?.keyName];
        entry.head.upvotes = stats?.upvotes ?? 0;
        entry.head.downvotes = stats?.downvotes ?? 0;
        entry.head.views = stats?.views ?? 0;
        return entry;
      });
    }

    return { Response: result };
  } catch (e) {
    return { Response: "No Data Found" };
  }
}
