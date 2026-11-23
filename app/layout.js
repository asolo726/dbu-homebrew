import { Geist, Geist_Mono } from "next/font/google";
import NavbarServer from "../components/navigation/NavbarServer";
import ScrollBackToTopButton from "../components/navigation/ScrollBackToTopButton";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import { auth } from "../auth";
import clientPromise from "../lib/mongoDBClient";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	metadataBase: new URL("https://dbu-homebrew.vercel.app"), // Change to your production URL
	title: "DBU: The Homebrew Galaxy",
	description:
		"The Dragon Ball Universe's Homebrew Galaxy, find all the homebrew content here!",
};

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

export default async function RootLayout({ children }) {
	let theme = "default";
	const cookieStore = await cookies();
	const cookieTheme = cookieStore.get("dbu-theme")?.value;

	try {
		const session = await auth();
		if (session?.user?.email) {
			if (themes.has(cookieTheme)) {
				theme = cookieTheme;
			}

			const client = await clientPromise;
			const user = await client
				.db()
				.collection("users")
				.findOne(
					{ email: session.user.email },
					{ projection: { theme: 1 } },
				);

			if (themes.has(user?.theme)) {
				theme = user.theme;
			}
		}
	} catch {
		theme = "default";
	}

	return (
		<html lang="en" data-theme={theme === "default" ? undefined : theme}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-center-safe`}
			>
				<SpeedInsights />
				<NavbarServer />
				<ScrollBackToTopButton />
				<div className="flex flex-col items-center w-full">
					{children}
				</div>
			</body>
		</html>
	);
}
