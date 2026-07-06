import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import clientPromise from "../../../../lib/mongoDBClient";
import { auth } from "../../../../auth";
import { notifyParentAuthorOnReply } from "../../../../lib/notifications";

export async function POST(request) {
  const { commentId, parentReplyId, text } = await request.json();

  if (!commentId || !text?.trim()) {
    return NextResponse.json({ error: "commentId and text required" }, { status: 400 });
  }

  const sanitized = text.trim().slice(0, 2000);
  const session = await auth();

  const reply = {
    _id: randomUUID(),
    text: sanitized,
    userId: session?.user?.email || null,
    userName: session?.user?.name || "Anonymous Warrior",
    userImage: session?.user?.image || null,
    timestamp: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    replies: [],
  };

  try {
    const client = await clientPromise;
    const db = client.db("Main");

    if (parentReplyId) {
      // Sub-reply: nest inside an existing top-level reply
      await db.collection("comments").updateOne(
        { _id: new ObjectId(commentId) },
        { $push: { "replies.$[r].replies": reply } },
        { arrayFilters: [{ "r._id": parentReplyId }] }
      );
    } else {
      // Top-level reply on the comment
      await db.collection("comments").updateOne(
        { _id: new ObjectId(commentId) },
        { $push: { replies: reply } }
      );
    }

    await notifyParentAuthorOnReply({
      commentId,
      parentReplyId,
      replierEmail: reply.userId,
      replierName: reply.userName,
      replyText: sanitized,
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("POST /api/comments/reply error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
