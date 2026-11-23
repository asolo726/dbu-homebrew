import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import clientPromise from "../../../../lib/mongoDBClient";

const themes = new Set([
	"default",
	"midnight",
	"midnight-red",
	"midnight-blue",
	"midnight-green",
	"kaioken",
	"ssj",
	"ssjb",
	"lssj",
	"orange",
	"beerus",
	"ui-sign",
	"mui",
]);

function setThemeCookie(response, theme) {
	response.cookies.set("dbu-theme", theme, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
		httpOnly: false,
	});
}

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
			.findOne(
				{ email: session.user.email },
				{ projection: { theme: 1 } },
			);

		const theme = themes.has(user?.theme) ? user.theme : "default";
		const response = NextResponse.json({ theme });
		setThemeCookie(response, theme);
		return response;
	} catch {
		const response = NextResponse.json({ theme: "default" });
		setThemeCookie(response, "default");
		return response;
	}
}

export async function PATCH(request) {
	const session = await auth();
	if (!session?.user?.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { theme } = await request.json();
		if (!themes.has(theme)) {
			return NextResponse.json(
				{ error: "Invalid theme" },
				{ status: 400 },
			);
		}

		const client = await clientPromise;
		const result = await client
			.db()
			.collection("users")
			.updateOne({ email: session.user.email }, { $set: { theme } });

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 },
			);
		}

		const response = NextResponse.json({ theme });
		setThemeCookie(response, theme);
		return response;
	} catch {
		return NextResponse.json(
			{ error: "Unable to update theme" },
			{ status: 500 },
		);
	}
}
