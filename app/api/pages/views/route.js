import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongoDBClient";
import { checkAndNotifyViewMilestone } from "../../../../lib/notifications";

export async function POST(request) {
  const { keyName } = await request.json();
  if (!keyName) {
    return NextResponse.json({ error: "keyName required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const updated = await client.db("Main").collection("statistics").findOneAndUpdate(
      { keyName },
      { $inc: { views: 1 } },
      { upsert: true, returnDocument: "after", projection: { views: 1 } }
    );
    const newViews = updated?.views ?? 1;

    await checkAndNotifyViewMilestone({ keyName, newViews });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/pages/views error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
