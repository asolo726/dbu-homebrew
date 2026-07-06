import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongoDBClient";

export async function POST(request) {
  const { keyName } = await request.json();
  if (!keyName) {
    return NextResponse.json({ error: "keyName required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    await client.db("Main").collection("statistics").updateOne(
      { keyName },
      { $inc: { views: 1 } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/pages/views error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
