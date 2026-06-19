import { auth } from "../../../auth";
import clientPromise from "../../../lib/mongoDBClient";
/**
 * Uploads the content provided to the database. 
 * Determines what collection to use based on the content.identity value
 * 
 * @param The Object to be uploaded
 * @returns {"status": status}
 */
export default async function uploadNewCreatedContent(creationObject){
    const session = await auth();

    // Checking Creation Object Output
    console.log("Creation Object:\n", creationObject);
    
    const client = await clientPromise;
    const dbCollection = client.db("content").collection(creationObject._head._identity);
    
    
    //Name check------------------
    // The underscores accessing the object variable is concerning, look into this later...
    const searchQuery = {"head.keyName": creationObject._head._keyName};
    const searchOptions = []; 
    const nameCheck = await dbCollection.findOne(searchQuery, searchOptions);
    if(nameCheck){
        return {status: "Name Taken"};
    }


    const status = await dbCollection.insertOne(creationObject.toJson());
    //Check if the insertion was successful
    if(status.acknowledged != true){
        return {status: "Failed"};
    }

    return {status: "Success"};
    
}