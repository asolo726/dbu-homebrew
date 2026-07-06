import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";
import { DEFAULT_NOTIFICATION_SETTINGS } from "../../../../lib/notifications";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const user = await client
      .db()
      .collection("users")
      .findOne({ email: session.user.email }, { projection: { notificationSettings: 1 } });

    const stored = user?.notificationSettings;
    const settings = {
      masterEnabled: stored?.masterEnabled ?? DEFAULT_NOTIFICATION_SETTINGS.masterEnabled,
      comments: { mode: stored?.comments?.mode ?? DEFAULT_NOTIFICATION_SETTINGS.comments.mode },
      upvotes: { enabled: stored?.upvotes?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.upvotes.enabled },
      views: { enabled: stored?.views?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.views.enabled },
    };

    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/settings/notifications error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const setFields = {};

    if (typeof body.masterEnabled === "boolean") {
      setFields["notificationSettings.masterEnabled"] = body.masterEnabled;
    }
    const validModes = ["all", "replies-only", "disabled"];
    if (validModes.includes(body.comments?.mode)) {
      setFields["notificationSettings.comments.mode"] = body.comments.mode;
    }
    if (typeof body.upvotes?.enabled === "boolean") {
      setFields["notificationSettings.upvotes.enabled"] = body.upvotes.enabled;
    }
    if (typeof body.views?.enabled === "boolean") {
      setFields["notificationSettings.views.enabled"] = body.views.enabled;
    }

    if (Object.keys(setFields).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const client = await clientPromise;
    await client
      .db()
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: setFields });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/settings/notifications error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
