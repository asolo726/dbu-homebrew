import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyName = searchParams.get("keyName");
  if (!keyName) {
    return NextResponse.json({ error: "keyName required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Main");
    const doc = await db.collection("statistics").findOne(
      { keyName },
      { projection: { upvotes: 1, downvotes: 1 } }
    );
    return NextResponse.json({
      upvotes: doc?.upvotes ?? 0,
      downvotes: doc?.downvotes ?? 0,
    });
  } catch (error) {
    console.error("GET /api/pages/vote error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const { keyName, voteType, remove = false } = await request.json();

  if (!keyName || !["up", "down"].includes(voteType)) {
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
    const col = db.collection("statistics");

    if (remove) {
      if (userId) {
        await col.updateOne(
          { keyName },
          { $inc: { [field]: -1 }, $pull: { [fieldBy]: userId } }
        );
      } else {
        await col.updateOne({ keyName }, { $inc: { [field]: -1 } });
      }
      return NextResponse.json({ success: true });
    }

    if (userId) {
      // Ensure doc exists before the conditional update
      await col.updateOne(
        { keyName },
        { $setOnInsert: { keyName, upvotes: 0, downvotes: 0, views: 0, upvotedBy: [], downvotedBy: [] } },
        { upsert: true }
      );
      const result = await col.updateOne(
        { keyName, [fieldBy]: { $ne: userId }, [otherBy]: { $ne: userId } },
        { $inc: { [field]: 1 }, $addToSet: { [fieldBy]: userId } }
      );
      if (result.modifiedCount === 0) {
        return NextResponse.json({ error: "Already voted" }, { status: 409 });
      }
    } else {
      await col.updateOne(
        { keyName },
        { $inc: { [field]: 1 } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/pages/vote error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
