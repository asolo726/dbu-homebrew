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
    for await (const collection of collections) {
      const entries = await db
        .collection(collection.name)
        .find({}, { projection: { _id: 0 } })
        .toArray();
      result[collection.name] = entries;
    }

    return { Response: result };
  } catch (e) {
    return { Response: "No Data Found" };
  }
}
