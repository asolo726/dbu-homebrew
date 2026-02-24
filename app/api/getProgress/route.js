import clientPromise from "../../../lib/mongoDBClient";

/**
 *
 * @param {*} session
 * Gets all the entries from the Update Cluster - Progress Collection
 * @returns On Successful Search, returns an Array[{}] of progress objects
 * @returns On Failed Search, returns {Response: "No Data Found"}
 */
export default async function GET() {
  const client = await clientPromise;
  const db = client.db("Update");

  const data = await db.collection("Progress").find({}).toArray();
  if (data) {
      // This loop Cleans up the Object IDs to be serializable and usable by Client Components.
      data.forEach(element => {
        element._id = element._id.toString();
      });
      
    return {Response: data};
  } else {
    return {Response: "No Data Found"};
  }
}
