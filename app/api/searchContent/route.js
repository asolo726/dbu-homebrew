import clientPromise from "../../../lib/mongoDBClient";
/** 
 *
 *
 * @returns If 1+ Finds: An object containing status and an array of the requested info { status: "status", content: [{}]}
 * @returns If 0 Finds: An object containing a failed status: {status: "failed"}
 */
export default async function GET(slug) {
    //Clean up searchParam to replace - with whitespace and capitalize letters
    const slugWithoutDash = slug.replaceAll("-", " ");
    const words = slugWithoutDash.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
            words[i] =
                words[i].charAt(0).toUpperCase() +
                words[i].slice(1).toLowerCase();
        }
    }

    const searchParam = words.join(" ");

    //Actual DB Work--------------------------------------------------------------------------------------------------------
    const client = await clientPromise;
    const db = client.db("content");
    const collections = await db.listCollections({}, { nameOnly: true }); //Returns found collections as an array of strings
    let resultArr = [];

    // Loops through every collection to find the searched Item.
    // If the search isn't null, is added to the resultArr
    for await (const collection of collections) { 
        const searchResult = await db.collection(collection.name).findOne({
            "head.title": searchParam,
        });
        
        if (searchResult) {
            resultArr.push(searchResult);
        }
    }
    
    if (resultArr.length >= 1) {
        return { status: "success", content: resultArr };
    } else {
        return { status: "failed" };
    }
}

// Turns out async and await dont work properly with the arr.forEach()! Who knew?
// This MongoDB Document is a Friend: https://www.mongodb.com/docs/drivers/node/current/
