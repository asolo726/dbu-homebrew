import { auth } from "../../../auth";
import clientPromise from "../../../lib/mongoDBClient";
/**
 * Uploads the content provided to the database. 
 * Determines what collection to use based on the content.identity value
 * 
 * @param {*} content JSON Object 
 * @returns {"status": status}
 */
export default async function uploadContent(creationOption, creationName, creationObject){
    const session = await auth();
    
    const client = await clientPromise;
    const db = client.db("content");
    
}