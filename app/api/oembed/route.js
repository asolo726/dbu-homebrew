const SITE_URL = "https://dbu-homebrew.vercel.app";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";
  const author = searchParams.get("author") || "";
  const url = searchParams.get("url") || "";

  return Response.json({
    version: "1.0",
    type: "link",
    provider_name: "DBU: The Homebrew Galaxy",
    provider_url: SITE_URL,
    author_name: author,
    author_url: url,
    title: title,
  });
}
