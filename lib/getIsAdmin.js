import clientPromise from "./mongoDBClient";

export async function getIsAdmin(email) {
  if (!email) return false;
  const client = await clientPromise;
  const user = await client
    .db()
    .collection("users")
    .findOne({ email }, { projection: { type: 1 } });
  return user?.type === "admin";
}
