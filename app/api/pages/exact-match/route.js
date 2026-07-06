import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

const normalizeForMatch = (s) => s.trim().toLowerCase().replace(/\s+/g, "-");

async function getViewerName(client, session) {
  if (!session?.user?.email) return null;
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { name: 1 } });
  return user?.name ?? null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ keyName: null });

  const normalized = normalizeForMatch(q);

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

    const matches = [];
    for (const col of collections) {
      const pages = await contentDb
        .collection(col.name)
        .find({}, { projection: { "head.title": 1, "head.keyName": 1, "head.author": 1, "head.toggle": 1, _id: 0 } })
        .toArray();

      for (const p of pages) {
        if (normalizeForMatch(p.head.title) !== normalized) continue;
        // Visible if: no toggle, toggle enabled, or viewer is the author
        const visible =
          isToggleEnabled(p.head.toggle, p.head.author) || (viewerName && p.head.author === viewerName);
        if (visible) matches.push(p.head.keyName);
      }
    }

    return NextResponse.json({ keyName: matches.length === 1 ? matches[0] : null });
  } catch (err) {
    console.error("GET /api/pages/exact-match error:", err);
    return NextResponse.json({ keyName: null });
  }
}
