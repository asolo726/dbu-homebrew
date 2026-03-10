import clientPromise from "../../../lib/mongoDBClient";

/**
 * Returns the first found content that matches the searchParam. Loops through all collections and returns the first found match. Returns null if no match is found.
 * @param {*} searchParam
 * @returns
 */
async function findContent(searchParam) {
  const client = await clientPromise;
  const db = client.db("content");
  const collections = await db.listCollections({}, { nameOnly: true }); //Returns found collections as an array of strings
  let resultArr = [];

  for await (const collection of collections) {
    const searchResult = await db.collection(collection.name).findOne({
      "head.keyName": searchParam,
    });
    if (searchResult) {
      resultArr.push(searchResult);
    }
  }
  return resultArr;
}

/**
 * Returns a cleaned up searchParam to be used in the DB search. Replaces - with whitespace and capitalizes the first letter of each word.
 * @param {*} slug
 */
function getSearchParam(slug) {
  // Clean up searchParam to replace - with whitespace and capitalize letters
  const slugWithoutDash = slug.replaceAll("-", " ");
  const words = slugWithoutDash.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
  }

  const searchParam = words.join(" ");
  return searchParam;
}

/**
 *
 *
 * @returns If 1+ Finds: An object containing status and an array of the requested info { status: "status", content: [{}]}
 * @returns If 0 Finds: An object containing a failed status: {status: "failed"}
 */
export default async function GET(slug) {
  const searchParam = slug;
  let resultArr = await findContent(searchParam);

  if (resultArr.length >= 1) {
    return { status: "success", content: resultArr };
  } else {
    return { status: "failed" };
  }
}

// Turns out async and await dont work properly with the arr.forEach()! Who knew?
// This MongoDB Document is a Friend: https://www.mongodb.com/docs/drivers/node/current/
