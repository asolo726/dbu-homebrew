import clientPromise from "../../../lib/mongoDBClient";

export default async function READ(toggleId, author) {
  if (!toggleId) return true;
  if (!author) return true;

  const toggleKey = `toggles.${author}.${toggleId}`;
  const client = await clientPromise;
  const db = client.db("Main");
  const result = await db
    .collection("toggles")
    .findOne({ [toggleKey]: { $exists: true } }, { projection: { [toggleKey]: 1, _id: 0 } });

  if (!result) return true;
  return result?.toggles?.[author]?.[toggleId] ?? true;
}
