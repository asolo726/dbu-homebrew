import SearchDataServer from "../../components/search/SearchDataServer";

export async function generateMetadata() {
  return {
    title: "DBU North Galaxy Homebrew Searcher",
    description:
      "Looking for specific homebrew? This page has got you covered. Art by WildBryar.",
    openGraph: {
      title: "DBU North Galaxy Homebrew Searcher",
      description:
        "Looking for specific homebrew? This page has got you covered. Art by WildBryar.",
      images:
        "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/IreallyShouldn%27tLetThatSaiyanHitBut.png",
      type: "website",
      siteName: "DBU: The Homebrew Galaxy",
    },
    authors: [{ name: "Asolo" }, { name: "Blasteroid" }, { name: "WildBryar" }],
  };
}

export default function Search() {
  return (
    <div className="self-stretch w-full mr-4">
      <SearchDataServer />
    </div>
  );
}
