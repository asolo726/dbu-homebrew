import SearchBar from "./searchBar";
import SearchDataServer from "../../../components/search/SearchDataServer";

export default function Search() {
    return (
        <div className="self-stretch w-full mr-4">
            <SearchBar />
            <SearchDataServer />
        </div>
    );
}