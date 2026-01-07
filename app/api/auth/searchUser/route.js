import clientPromise from "../../../../lib/mongoDBClient";

/**
 * 
 * @param {*} session 
 * @returns On Successful Search, returns user object: {_id, name, email}
 * @returns On Failed Search, returns null
 */
export default async function READ(session){
    const client = await clientPromise;
    const db = client.db("Main");
    const result = await db.collection('users').findOne({email: session.user.email})
    if (result) {
        return result;
    }
    else{
        return "No User Found";
    }
}