import { auth } from "../../../auth";
import clientPromise from "../../../lib/mongoDBClient";

export async function DELETE(request) {
	const session = await auth();
	if (!session?.user?.email) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { keyName, title } = await request.json();
	if (!keyName || !title) {
		return Response.json({ error: "Invalid request" }, { status: 400 });
	}

	const client = await clientPromise;
	const user = await client
		.db()
		.collection("users")
		.findOne(
			{ email: session.user.email },
			{ projection: { name: 1, type: 1 } },
		);
	const isAdmin = user?.type === "admin";
	const db = client.db("content");
	const collections = await db.listCollections({}, { nameOnly: true });

	for await (const collection of collections) {
		const pages = db.collection(collection.name);
		const page = await pages.findOne({ "data.keyName": keyName });
		if (!page) continue;

		const pageTitle = page.head?.title ?? "";
		const isCommunity = !!page.data?.management?.isCommunity;
		const isAuthor = page.data?.author === user?.name;
		const canDelete = isAdmin || (!isCommunity && isAuthor);

		if (!canDelete) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}
		if (pageTitle !== title) {
			return Response.json(
				{ error: "The page title did not match." },
				{ status: 400 },
			);
		}

		await pages.deleteOne({ _id: page._id });
		return Response.json({ success: true });
	}

	return Response.json({ error: "Document not found" }, { status: 404 });
}
