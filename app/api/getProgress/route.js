import clientPromise from "../../../lib/mongoDBClient";

/**
 *
 * @param {*} session
 * @returns On Successful Search, returns progress objects
 */
export default async function GET() {
  const client = await clientPromise;
  const db = client.db("Update");

  const data = await db.collection("Progress").find({}).toArray();

  if (data) {
    return Response.json(data);
  } else {
    return Response.json(null);
  }
}
