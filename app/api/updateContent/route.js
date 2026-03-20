import { auth } from "../../../auth";
import clientPromise from "../../../lib/mongoDBClient";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyName, changes } = await request.json();

  if (!keyName || !changes || Object.keys(changes).length === 0) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("content");
  const collections = await db.listCollections({}, { nameOnly: true });

  for await (const col of collections) {
    const result = await db.collection(col.name).updateOne(
      { "head.keyName": keyName },
      { $set: changes }
    );
    if (result.matchedCount > 0) {
      return Response.json({ success: true, modified: result.modifiedCount });
    }
  }

  return Response.json({ error: "Document not found" }, { status: 404 });
}
