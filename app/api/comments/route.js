import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongoDBClient";
import { auth } from "../../../auth";
import { notifyPageAuthorNewComment } from "../../../lib/notifications";

const COMMENTS_PER_PAGE = 20;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get("pageKey");
  const skip = parseInt(searchParams.get("skip") || "0", 10);

  if (!pageKey) {
    return NextResponse.json({ error: "pageKey required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Main");
    const collection = db.collection("comments");

    const [comments, total] = await Promise.all([
      collection
        .find({ pageKey })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(COMMENTS_PER_PAGE)
        .toArray(),
      collection.countDocuments({ pageKey }),
    ]);

    const serialized = comments.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json({ comments: serialized, total });
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const { pageKey, text } = await request.json();

  if (!pageKey || !text?.trim()) {
    return NextResponse.json({ error: "pageKey and text required" }, { status: 400 });
  }

  const sanitized = text.trim().slice(0, 2000);
  const session = await auth();

  let displayName = "Anonymous Warrior";
  if (session?.user?.email) {
    const client = await clientPromise;
    const userDoc = await client
      .db() // use URI default — same db the MongoDBAdapter writes users to
      .collection("users")
      .findOne({ email: session.user.email }, { projection: { username: 1, name: 1 } });
    displayName = userDoc?.name || "Anonymous Warrior";
  }

  const userId = session?.user?.email || null;
  const comment = {
    pageKey,
    text: sanitized,
    userId,
    userName: displayName,
    userImage: session?.user?.image || null,
    timestamp: new Date(),
    upvotes: 1,
    upvotedBy: userId ? [userId] : [],
    downvotes: 0,
    replies: [],
  };

  try {
    const client = await clientPromise;
    const db = client.db("Main");
    const result = await db.collection("comments").insertOne(comment);

    await notifyPageAuthorNewComment({
      pageKey,
      commenterEmail: userId,
      commenterName: displayName,
      commentText: sanitized,
    });

    return NextResponse.json({
      ...comment,
      _id: result.insertedId.toString(),
      timestamp: comment.timestamp.toISOString(),
    });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
