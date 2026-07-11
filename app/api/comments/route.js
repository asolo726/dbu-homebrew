import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongoDBClient";
import { auth } from "../../../auth";

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
  let commenterIsAdmin = false;
  if (session?.user?.email) {
    const client = await clientPromise;
    const userDoc = await client
      .db()
      .collection("users")
      .findOne({ email: session.user.email }, { projection: { name: 1, type: 1 } });
    displayName = userDoc?.name || "Anonymous Warrior";
    commenterIsAdmin = userDoc?.type === "admin";
  }

  const userId = session?.user?.email || null;
  const comment = {
    pageKey,
    text: sanitized,
    userId,
    userName: displayName,
    userImage: session?.user?.image || null,
    isAdmin: commenterIsAdmin,
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

export async function DELETE(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await request.json();
  if (!commentId) {
    return NextResponse.json({ error: "commentId required" }, { status: 400 });
  }

  const client = await clientPromise;
  const userDoc = await client
    .db()
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { type: 1 } });

  if (userDoc?.type !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const db = client.db("Main");
    const result = await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(commentId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/comments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
