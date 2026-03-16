import getPages from "../../app/api/getPages/route";
import CardGenerator from "../../app/home/search/CardGenerator";

export default async function SearchDataServer() {
    const pageData = await getPages();
    return <CardGenerator pageData={pageData} />
}