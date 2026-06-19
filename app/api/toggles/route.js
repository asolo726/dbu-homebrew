import clientPromise from "../../../lib/mongoDBClient";

/**
 *
 * @param {*} session
 * @returns On Successful Search, returns user object: {_id, name, email}
 * @returns On Failed Search, returns "No User Found"
 */
export default async function READ(toggleId) {
  // Entries don't always have a toggle field, so return false if toggleId is not provided
  if (!toggleId || toggleId === undefined) {
    console.log("true");
    return true;
  };
  const toggleKey = "toggles." + toggleId;
  const client = await clientPromise;
  const db = client.db("Main");
  const result = await db
    .collection("toggles")
    .findOne({ [toggleKey]: { $exists: true } }, { projection: { [toggleKey]: 1, _id: 0 } });

  console.log("Toggle check result:", result["toggles"][toggleId]);
    return result["toggles"][toggleId];
}
