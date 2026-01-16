const { MongoClient } = require("../../lib/mongoDBClient");

exports.handler = async (event, context) => {
    let client;
    try {
        // The MONGODB_URI is automatically injected by Netlify
        client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        const db = client.db("Main"); // Replace with your database name
        const collection = db.collection("users"); // Replace with your collection name

        // Perform database operations (e.g., find, insert, update)
        const email = event.queryStringParameters.email;
        const result = await collection.findOne({ email: email });
        if (result) {
            return {
                statusCode: 200,
                body: JSON.stringify(result),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ msg: "No User Found" }),
            };
        }
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: error.message }),
        };
    } finally {
        // Ensure that the client will close when you finish/error
        if (client) {
            await client.close();
        }
    }
};
