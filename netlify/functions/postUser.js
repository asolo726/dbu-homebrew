import clientPromise from "../../lib/mongoDBClient";
import getToken from "./oktaGetToken.mjs";
/**
 * Uses email parameter to search for OKTA ID
 * @param {string} emailToSearchWith 
 */
async function GET_OKTA_ID(emailToSearchWith) {
    const tokenRes = await getToken();
    const token = tokenRes.access_token;
    const domain = process.env.OKTA_DOMAIN;
    let oktaJson
    try {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append(
            "Authorization",
            "Bearer " + token
        );
        console.log("Header:", myHeaders);
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        const result = await fetch(
            domain + `/api/v2/users?q=email%3A%22${emailToSearchWith}%22`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                // console.log('OKTAIDRESULT:', result)
                oktaJson = result
            })
            .catch((error) => console.log("error", error));

        return oktaJson;
    } catch (error) {
        console.log("Okta Get Token Error", error);
    }
}

/**
 * Inserts user into MongoDB using session's email to find OKTA_ID
 */
exports.handler = async (event, context) => {
    const email = event.queryStringParameters.email;
    const client = await clientPromise;
    const db = client.db("Main");
    const oktaResult = await GET_OKTA_ID(email);
    const oktaId = oktaResult[0].user_id;

    await db.collection("users").insertOne({
        oktaID: oktaId,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        type: 'viewer', //Default value for user. Change manually in MongoDB
    });

    return { statusCode: 200, body: "Success" };
}
