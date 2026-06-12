import clientPromise from "../../../lib/mongoDBClient";

/**
 *
 * @param {*} session
 * @returns On Successful Search, returns user object: {_id, name, email}
 * @returns On Failed Search, returns "No User Found"
 */
export default async function READ(toggleId) {
  const toggleKey = "toggles." + toggleId;
  const client = await clientPromise;
  const db = client.db("Main");
  const result = await db
    .collection("toggles")
    .findOne({ [toggleKey]: { $exists: true } }, { projection: { [toggleKey]: 1, _id: 0 } });

    return result["toggles"][toggleId];
}
