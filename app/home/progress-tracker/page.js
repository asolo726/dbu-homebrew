import ProgressDataServer from "../../../components/ProgressBarComponents/ProgressDataServer";

export async function generateMetadata() {
  return {
    title: "DBU 0.9.3 Update Progress Tracker",
    description:
      "A comprehensive progress tracker for the DBU 0.9.3 update, showcasing the current status of page updates, new content additions, and estimated time until completion.",
    openGraph: {
      title: "DBU 0.9.3 Update Progress Tracker",
      description:
        "A comprehensive progress tracker for the DBU 0.9.3 update, showcasing the current status of page updates, new content additions, and estimated time until completion.",
      images:
        "https://dbu-rpg-northgalaxy.vercel.app/just_chilling_and_watching_the_progress.webp",
      type: "website",
      siteName: "DBU: The Homebrew Galaxy",
    },
    authors: [{ name: "Asolo" }, { name: "Blasteroid" }],
  };
}

export default function ProgressTracker() {
  return <ProgressDataServer />;
}
