import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { oldName, newName } = await request.json();
  if (!oldName || !newName?.trim()) {
    return NextResponse.json(
      { error: "oldName and newName are required" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("content");
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();

  // Arrays that may contain contributor-tagged items
  const contributorArrays = ["traits", "masteryTrait"];

  let totalUpdated = 0;
  for (const col of collections) {
    const result = await db
      .collection(col.name)
      .updateMany(
        { "head.author": oldName },
        { $set: { "head.author": newName.trim() } }
      );
    totalUpdated += result.modifiedCount;

    // Propagate name change into community contribution attribution
    for (const arrayField of contributorArrays) {
      await db.collection(col.name).updateMany(
        { [`${arrayField}.contributor.email`]: session.user.email },
        { $set: { [`${arrayField}.$[elem].contributor.name`]: newName.trim() } },
        { arrayFilters: [{ "elem.contributor.email": session.user.email }] }
      );
    }
  }

  return NextResponse.json({ success: true, updatedCount: totalUpdated });
}
