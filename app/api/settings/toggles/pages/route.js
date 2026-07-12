import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import clientPromise from "../../../../../lib/mongoDBClient";

async function getViewerName(client, session) {
  if (!session?.user?.email) return null;
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { name: 1 } });
  return user?.name ?? null;
}

// GET /api/settings/toggles/pages?toggle=<toggleName>
// Returns all pages authored by the current user, split into:
//   withToggle    – pages where head.toggle === toggleName
//   withoutToggle – all other authored pages
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const toggleName = searchParams.get("toggle");
  if (!toggleName) {
    return NextResponse.json({ error: "toggle param required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const viewerName = await getViewerName(client, session);
    if (!viewerName) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const contentDb = client.db("content");
    const collections = await contentDb.listCollections({}, { nameOnly: true }).toArray();

    const withToggle = [];
    const withoutToggle = [];

    for (const col of collections) {
      const pages = await contentDb
        .collection(col.name)
        .find(
          { "head.author": viewerName },
          { projection: { "head.keyName": 1, "head.title": 1, "head.toggle": 1, _id: 0 } }
        )
        .toArray();

      for (const p of pages) {
        const info = { keyName: p.head.keyName, title: p.head.title, collection: col.name };
        if (p.head.toggle === toggleName) {
          withToggle.push(info);
        } else {
          withoutToggle.push(info);
        }
      }
    }

    return NextResponse.json({ withToggle, withoutToggle });
  } catch (err) {
    console.error("GET /api/settings/toggles/pages error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/settings/toggles/pages
// Body: { toggleName, addPages: [{keyName, collection}], removePages: [{keyName, collection}] }
// Applies toggle assignment changes to pages in the content DB.
export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { toggleName, addPages = [], removePages = [] } = await request.json();
    if (!toggleName) {
      return NextResponse.json({ error: "toggleName required" }, { status: 400 });
    }

    const client = await clientPromise;
    const viewerName = await getViewerName(client, session);
    if (!viewerName) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const contentDb = client.db("content");

    const ops = [
      ...addPages.map((p) =>
        contentDb
          .collection(p.collection)
          .updateOne(
            { "head.keyName": p.keyName, "head.author": viewerName },
            { $set: { "head.toggle": toggleName } }
          )
      ),
      ...removePages.map((p) =>
        contentDb
          .collection(p.collection)
          .updateOne(
            { "head.keyName": p.keyName, "head.author": viewerName },
            { $unset: { "head.toggle": "" } }
          )
      ),
    ];

    await Promise.all(ops);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/settings/toggles/pages error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
