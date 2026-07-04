import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongoDBClient";
import { auth } from "../../../../auth";

export async function POST(request) {
  const { commentId, replyId, parentReplyId, voteType, remove = false } =
    await request.json();

  if (!commentId || !["up", "down"].includes(voteType)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.email || null;

  const field = voteType === "up" ? "upvotes" : "downvotes";
  const fieldBy = voteType === "up" ? "upvotedBy" : "downvotedBy";
  const otherBy = voteType === "up" ? "downvotedBy" : "upvotedBy";

  try {
    const client = await clientPromise;
    const db = client.db("Main");
    let result;

    if (remove) {
      // ── Un-vote ──────────────────────────────────────────────────────────
      if (replyId && parentReplyId) {
        if (userId) {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            {
              $inc: { [`replies.$[r].replies.$[sr].${field}`]: -1 },
              $pull: { [`replies.$[r].replies.$[sr].${fieldBy}`]: userId },
            },
            {
              arrayFilters: [
                { "r._id": parentReplyId },
                { "sr._id": replyId, [`sr.${fieldBy}`]: userId },
              ],
            }
          );
        } else {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            { $inc: { [`replies.$[r].replies.$[sr].${field}`]: -1 } },
            { arrayFilters: [{ "r._id": parentReplyId }, { "sr._id": replyId }] }
          );
        }
      } else if (replyId) {
        if (userId) {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            {
              $inc: { [`replies.$[r].${field}`]: -1 },
              $pull: { [`replies.$[r].${fieldBy}`]: userId },
            },
            { arrayFilters: [{ "r._id": replyId, [`r.${fieldBy}`]: userId }] }
          );
        } else {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId), "replies._id": replyId },
            { $inc: { [`replies.$.${field}`]: -1 } }
          );
        }
      } else {
        if (userId) {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId), [fieldBy]: userId },
            { $inc: { [field]: -1 }, $pull: { [fieldBy]: userId } }
          );
        } else {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            { $inc: { [field]: -1 } }
          );
        }
      }
    } else {
      // ── Cast vote ─────────────────────────────────────────────────────────
      if (replyId && parentReplyId) {
        if (userId) {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            {
              $inc: { [`replies.$[r].replies.$[sr].${field}`]: 1 },
              $addToSet: { [`replies.$[r].replies.$[sr].${fieldBy}`]: userId },
            },
            {
              arrayFilters: [
                { "r._id": parentReplyId },
                {
                  "sr._id": replyId,
                  [`sr.${fieldBy}`]: { $ne: userId },
                  [`sr.${otherBy}`]: { $ne: userId },
                },
              ],
            }
          );
        } else {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            { $inc: { [`replies.$[r].replies.$[sr].${field}`]: 1 } },
            { arrayFilters: [{ "r._id": parentReplyId }, { "sr._id": replyId }] }
          );
        }
      } else if (replyId) {
        if (userId) {
          result = await db.collection("comments").updateOne(
            {
              _id: new ObjectId(commentId),
              replies: {
                $elemMatch: {
                  _id: replyId,
                  [fieldBy]: { $ne: userId },
                  [otherBy]: { $ne: userId },
                },
              },
            },
            {
              $inc: { [`replies.$.${field}`]: 1 },
              $addToSet: { [`replies.$.${fieldBy}`]: userId },
            }
          );
        } else {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId), "replies._id": replyId },
            { $inc: { [`replies.$.${field}`]: 1 } }
          );
        }
      } else {
        if (userId) {
          result = await db.collection("comments").updateOne(
            {
              _id: new ObjectId(commentId),
              [fieldBy]: { $ne: userId },
              [otherBy]: { $ne: userId },
            },
            { $inc: { [field]: 1 }, $addToSet: { [fieldBy]: userId } }
          );
        } else {
          result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            { $inc: { [field]: 1 } }
          );
        }
      }

      if (userId && result?.modifiedCount === 0) {
        return NextResponse.json({ error: "Already voted" }, { status: 409 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/comments/vote error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
