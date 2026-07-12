import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";
import { ObjectId } from "mongodb";

export async function PATCH(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { newName } = await request.json();
  if (!newName?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(); // use URI default — same db the MongoDBAdapter writes users to

  // Prefer _id lookup (most reliable), fall back to email
  let filter;
  try {
    filter = { _id: new ObjectId(session.user.id) };
  } catch {
    filter = { email: session.user.email };
  }

  const trimmed = newName.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const taken = await db.collection("users").findOne({
    name: { $regex: new RegExp(`^${escaped}$`, "i") },
    email: { $ne: session.user.email },
  });
  if (taken) {
    return NextResponse.json({ error: "That name is already taken" }, { status: 409 });
  }

  const result = await db.collection("users").updateOne(
    filter,
    { $set: { name: trimmed } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
