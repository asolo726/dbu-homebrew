import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarServer from "../components/navComponents/NavbarServer";
import { HelmetProvider } from 'react-helmet-async';
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
  description: "The Dragon Ball Universe's Homebrew Galaxy, find all the homebrew content here!",
};

export default function RootLayout({ children }) {
  return (
    <HelmetProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-center-safe`}
        >
          <NavbarServer />
          <div className="grid justify-center">{children}</div>
        </body>
      </html>
    </HelmetProvider>
  );
}
