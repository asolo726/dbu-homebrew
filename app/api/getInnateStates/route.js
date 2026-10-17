import clientPromise from "../../../lib/mongoDBClient";
/**
 * Gets all Innate States from the aspects collection, in the Main database.
 * @returns On a successful search, returns an array that contains normal Innate States, special Innate States,
 *  and custom Innate States.
 * @returns On a failed search, returns a Server Error
 */
export async function GET(){
    const client = await clientPromise;
    try {
        const db = client.db("Main");
        const data = await db
            .collection("aspects")
            .findOne({}, { projection: { _id: 1 } });
        
        const baseInnateStates = data.baseInnateStates;
        const specialInnateStates = data.specialInnateStates;

        return Response.json({baseInnateStates, specialInnateStates});
    } catch (error) {
        console.error("GET /api/getInnateStates error:", error);
        return {Response: "Server error"}
    }
}
