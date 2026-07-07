import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

const PER_PAGE = 10;

async function getViewerName(client, session) {
  if (!session?.user?.email) return null;
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { name: 1 } });
  return user?.name ?? null;
}

// GET /api/settings/toggles?page=1
// Returns the current user's toggles, paginated 10 per page.
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

  try {
    const client = await clientPromise;
    const viewerName = await getViewerName(client, session);
    if (!viewerName) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const toggleKey = `toggles.${viewerName}`;
    const doc = await client
      .db("Main")
      .collection("toggles")
      .findOne(
        { [toggleKey]: { $exists: true } },
        { projection: { [toggleKey]: 1, _id: 0 } }
      );

    const userToggles = doc?.toggles?.[viewerName] ?? {};
    const entries = Object.entries(userToggles).map(([name, enabled]) => ({ name, enabled }));
    const total = entries.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const start = (page - 1) * PER_PAGE;
    const toggles = entries.slice(start, start + PER_PAGE);

    return NextResponse.json({ toggles, total, page, totalPages });
  } catch (err) {
    console.error("GET /api/settings/toggles error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/settings/toggles
// Body: { toggleName: string, enabled: boolean }
// Flips a single toggle on or off.
export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { toggleName, enabled } = await request.json();
    if (!toggleName || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "toggleName and enabled required" }, { status: 400 });
    }

    const client = await clientPromise;
    const viewerName = await getViewerName(client, session);
    if (!viewerName) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const toggleKey = `toggles.${viewerName}.${toggleName}`;
    await client
      .db("Main")
      .collection("toggles")
      .updateOne({}, { $set: { [toggleKey]: enabled } }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/settings/toggles error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
