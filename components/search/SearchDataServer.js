import getPages from "../../app/api/getPages/route";
import SearchClient from "./SearchClient";
import checkToggle from "../../app/api/toggles/route.js";
import { auth } from "../../auth";
import clientPromise from "../../lib/mongoDBClient";

async function getViewerName(session) {
  if (!session?.user?.email) return null;
  const client = await clientPromise;
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: session.user.email }, { projection: { name: 1 } });
  return user?.name ?? null;
}

// Unfun Fact: Array.prototype.filter() does not wait for async callbacks.
// We need to resolve toggle checks before deciding whether to keep each entry.
async function filterPagesByToggles(pageData, viewerName) {
  const filteredData = { Response: {} };

  for (const [category, entries] of Object.entries(pageData.Response)) {
    const filteredEntries = await Promise.all(
      entries.map(async (entry) => {
        // Authors always see their own pages regardless of toggle
        if (viewerName && entry.head?.author === viewerName) return entry;
        if (entry.head?.toggle) {
          const enabled = await checkToggle(entry.head.toggle, entry.head.author);
          return enabled ? entry : null;
        }
        return entry;
      }),
    );

    filteredData.Response[category] = filteredEntries.filter(Boolean);
  }

  return filteredData;
}

export default async function SearchDataServer() {
  const session = await auth();
  const viewerName = await getViewerName(session);
  const pageData = await getPages();
  const filteredPageData = await filterPagesByToggles(pageData, viewerName);
  return <SearchClient pageData={filteredPageData} />;
}
