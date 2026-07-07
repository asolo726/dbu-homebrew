import { auth } from "../../../auth";
import clientPromise from "../../../lib/mongoDBClient";

// If both "traits.0.abilities" and "traits.0.abilities.0.desc" are in changes,
// MongoDB will reject the $set with a path conflict. This function detects any
// child-path key whose parent is an array already in changes, applies the child
// change into that array, and removes the conflicting child key.
function resolveConflicts(changes) {
  const resolved = { ...changes };
  const keys = Object.keys(resolved);

  for (const childKey of keys) {
    for (const parentKey of keys) {
      if (parentKey === childKey) continue;
      if (!childKey.startsWith(parentKey + ".")) continue;
      if (!Array.isArray(resolved[parentKey])) continue;

      const subPath = childKey.slice(parentKey.length + 1).split(".");
      const clone = JSON.parse(JSON.stringify(resolved[parentKey]));
      let cursor = clone;
      for (let i = 0; i < subPath.length - 1; i++) {
        const seg = subPath[i];
        cursor = cursor[isNaN(seg) ? seg : Number(seg)];
        if (cursor == null) break;
      }
      if (cursor != null) {
        const last = subPath[subPath.length - 1];
        cursor[isNaN(last) ? last : Number(last)] = resolved[childKey];
        resolved[parentKey] = clone;
      }
      delete resolved[childKey];
    }
  }

  return resolved;
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyName, changes } = await request.json();

  if (!keyName || !changes || Object.keys(changes).length === 0) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const safeChanges = resolveConflicts(changes);

  const client = await clientPromise;
  const db = client.db("content");
  const collections = await db.listCollections({}, { nameOnly: true });

  for await (const col of collections) {
    const result = await db.collection(col.name).updateOne(
      { "head.keyName": keyName },
      { $set: safeChanges }
    );
    if (result.matchedCount > 0) {
      return Response.json({ success: true, modified: result.modifiedCount });
    }
  }

  return Response.json({ error: "Document not found" }, { status: 404 });
}
