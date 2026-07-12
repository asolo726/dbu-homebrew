import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

async function findPage(db, keyName) {
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  for (const col of collections) {
    const doc = await db.collection(col.name).findOne(
      { "head.keyName": keyName },
      { projection: { "head.author": 1, "head.communityAllowlist": 1 } }
    );
    if (doc) return { doc, colName: col.name };
  }
  return null;
}

async function resolveAllowlistNames(mainDb, emails) {
  if (!emails || emails.length === 0) return [];
  const users = await mainDb
    .collection("users")
    .find({ email: { $in: emails } }, { projection: { email: 1, name: 1 } })
    .toArray();
  const nameMap = Object.fromEntries(users.map((u) => [u.email, u.name]));
  return emails.map((email) => ({ email, name: nameMap[email] ?? email }));
}

async function getRequesterInfo(session, mainDb) {
  if (!session?.user?.email) return null;
  const user = await mainDb
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { name: 1, type: 1 } });
  return user ? { email: session.user.email, name: user.name, isAdmin: user.type === "admin" } : null;
}

// GET /api/community/allowlist?keyName=xxx — returns current members with names
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyName = searchParams.get("keyName");
  if (!keyName) return NextResponse.json({ error: "keyName required" }, { status: 400 });

  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const contentDb = client.db("content");
  const mainDb = client.db();

  const found = await findPage(contentDb, keyName);
  if (!found) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const requester = await getRequesterInfo(session, mainDb);
  if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAuthorOrAdmin = requester.isAdmin || found.doc.head.author === requester.name;
  if (!isAuthorOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const members = await resolveAllowlistNames(mainDb, found.doc.head.communityAllowlist ?? []);
  return NextResponse.json({ members });
}

// POST /api/community/allowlist — add a user by username
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { keyName, username } = await request.json();
  if (!keyName || !username?.trim()) {
    return NextResponse.json({ error: "keyName and username required" }, { status: 400 });
  }

  const client = await clientPromise;
  const contentDb = client.db("content");
  const mainDb = client.db();

  const requester = await getRequesterInfo(session, mainDb);
  if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const found = await findPage(contentDb, keyName);
  if (!found) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const isAuthorOrAdmin = requester.isAdmin || found.doc.head.author === requester.name;
  if (!isAuthorOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Look up target user by username
  const targetUser = await mainDb
    .collection("users")
    .findOne({ name: username.trim() }, { projection: { email: 1, name: 1 } });
  if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const currentList = found.doc.head.communityAllowlist ?? [];
  if (currentList.includes(targetUser.email)) {
    return NextResponse.json({ error: "User already in allowlist" }, { status: 409 });
  }

  const updatedList = [...currentList, targetUser.email];
  await contentDb.collection(found.colName).updateOne(
    { "head.keyName": keyName },
    { $set: { "head.communityAllowlist": updatedList } }
  );

  const members = await resolveAllowlistNames(mainDb, updatedList);
  return NextResponse.json({ members });
}

// DELETE /api/community/allowlist — remove a user by email
export async function DELETE(request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { keyName, email } = await request.json();
  if (!keyName || !email) {
    return NextResponse.json({ error: "keyName and email required" }, { status: 400 });
  }

  const client = await clientPromise;
  const contentDb = client.db("content");
  const mainDb = client.db();

  const requester = await getRequesterInfo(session, mainDb);
  if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const found = await findPage(contentDb, keyName);
  if (!found) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const isAuthorOrAdmin = requester.isAdmin || found.doc.head.author === requester.name;
  if (!isAuthorOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updatedList = (found.doc.head.communityAllowlist ?? []).filter((e) => e !== email);
  await contentDb.collection(found.colName).updateOne(
    { "head.keyName": keyName },
    { $set: { "head.communityAllowlist": updatedList } }
  );

  const members = await resolveAllowlistNames(mainDb, updatedList);
  return NextResponse.json({ members });
}
