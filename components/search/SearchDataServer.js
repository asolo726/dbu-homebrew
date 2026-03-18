import getPages from "../../app/api/getPages/route";
import SearchClient from "./SearchClient";

export default async function SearchDataServer() {
    const pageData = await getPages();
    return <SearchClient pageData={pageData} />;
}
