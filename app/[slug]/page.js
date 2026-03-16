import SinglePageGenerator from "../../components/render/SinglePageGenerator.js";
import searchContent from "../api/searchContent/route.js";

const SITE_URL = "https://dbu-homebrew.vercel.app";
const SLUG_PATTERN = /^(\w+[-]?)+$/;

//This Regex pattern checks that a url search only contains alphanumerical characters and a -
//Example: "Super-Saiyan-3" is a match. "{GetUsers} is not a match."
//This site is very helpful: https://regex101.com
export const pattern = /^(\w+[-]?)+$/;


export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!SLUG_PATTERN.test(slug)) {
    return { title: "Invalid URL" };
  }

  const searchResult = await searchContent(slug);

  if (searchResult.status === "failed") {
    return {
      title: "Content Not Found",
      description:
        "The content you are looking for does not exist or has not been published yet.",
    };
  }

  const siteName = "DBU: The Homebrew Galaxy";
  const result = searchResult.content[0];
  const title = result.head.title;
  const description = result.head.desc;
  const image = result.head.banner || `${SITE_URL}/whosthatzfighter.webp`;
  const url = `${SITE_URL}/${result.head.keyName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * 1. Search DB for entry that matches the slug. I.e: {slug: Super-Saiyan} searches for Super-Saiyan
 *  - Prior to picking a Type, possibly create an array that holds the entries found if there are multiple.
 *    - Then it should load a page with a list of the entries found. Then the user can select which page to load.
 * 2. Check FormType to pick which component is used to render the page.
 *
 *  */

export default async function Page({ params }) {
  const { slug } = await params;

  if (pattern.test(slug) === false) {
    return (
      <div className="flex flex-col justify-center">
        <h1>
          Whatever the hell you just typed in was invalid. Only letters,
          numbers, and - is acceptable.
        </h1>
        <h1>Anything else makes you look fishy. And I DON'T. LIKE. FISHES.</h1>
        <button className="mt-10">
          <a
            className="p-5 rounded-xl bg-dbu-link text-white font-bold "
            href="/"
          >
            Home
          </a>
        </button>
      </div>
    );
  }

  const searchResult = await searchContent(slug);
  if (searchResult.status === "failed") {
    return (
      <div className="flex flex-col justify-center">
        <h1>
          Hmmm, looks like that doesn't exist. That page probably doesn't exist
          or hasn't been published yet.
        </h1>
        <button className="mt-10">
          <a
            className="p-5 rounded-xl bg-dbu-link text-white font-bold "
            href="/"
          >
            Home
          </a>
        </button>
      </div>
    );
  }
  if (searchResult.content.length === 1) {
    const content = searchResult.content[0];
    const oEmbedUrl = `${SITE_URL}/api/oembed?url=${encodeURIComponent(`${SITE_URL}/${slug}`)}&title=${encodeURIComponent(content.head.title)}&author=${encodeURIComponent(content.head.author || "")}`;
    return (
      <>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={oEmbedUrl}
          title={content.head.title}
        />
        <SinglePageGenerator content={content} />
      </>
    );
  }
}
