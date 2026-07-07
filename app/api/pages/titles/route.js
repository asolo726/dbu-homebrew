import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

async function getViewerName(client, session) {
  if (!session?.user?.email) return null;
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { name: 1 } });
  return user?.name ?? null;
}

export async function GET() {
  try {
    const session = await auth();
    const client = await clientPromise;
    const viewerName = await getViewerName(client, session);

    // Fetch all toggle statuses in one query
    const togglesDoc = await client.db("Main").collection("toggles").findOne({});
    const toggleMap = togglesDoc?.toggles ?? {};
    const isToggleEnabled = (toggleId, author) => {
      if (!toggleId || !author) return true;
      return toggleMap[author]?.[toggleId] ?? true;
    };

    const contentDb = client.db("content");
    const collections = await contentDb.listCollections({}, { nameOnly: true }).toArray();

    const titles = [];
    for (const col of collections) {
      const pages = await contentDb
        .collection(col.name)
        .find({}, { projection: { "head.title": 1, "head.keyName": 1, "head.author": 1, "head.toggle": 1, _id: 0 } })
        .toArray();

      for (const p of pages) {
        if (!p.head?.title || !p.head?.keyName) continue;
        const visible =
          isToggleEnabled(p.head.toggle, p.head.author) || (viewerName && p.head.author === viewerName);
        if (visible) titles.push({ title: p.head.title, keyName: p.head.keyName });
      }
    }

    return NextResponse.json(titles, {
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch (err) {
    console.error("GET /api/pages/titles error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
