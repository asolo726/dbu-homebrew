import getPages from "../../app/api/getPages/route";
import SearchClient from "./SearchClient";
import checkToggle from "../../app/api/toggles/route.js";

// Unfun Fact: Array.prototype.filter() does not wait for async callbacks.
// We need to resolve toggle checks before deciding whether to keep each entry.
async function filterPagesByToggles(pageData) {
  const filteredData = { Response: {} };

  for (const [category, entries] of Object.entries(pageData.Response)) {
    const filteredEntries = await Promise.all(
      entries.map(async (entry) => {
        if (entry.head?.toggle) {
          const enabled = await checkToggle(entry.head.toggle);
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
  const pageData = await getPages();
  const filteredPageData = await filterPagesByToggles(pageData);
  return <SearchClient pageData={filteredPageData} />;
}
