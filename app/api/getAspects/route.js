import clientPromise from "../../../lib/mongoDBClient";

/**
 * @param {*} session
 * Gets all Aspects from the Main.aspects cluster.
 * @returns On a Successful search, returns an Array with each Aspect as an entry.
 * @returns On a Failed search, returns a No Data Response
 */
export async function GET() {
  const client = await clientPromise;
  const db = client.db("Main");

  const aspects = await db.collection("aspects").findOne({}, { projection: { _id: 0 } });
  return Response.json(aspects);
}