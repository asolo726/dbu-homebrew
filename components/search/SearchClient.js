"use client";
import { useState } from "react";
import SearchBar from "../../app/home/search/searchBar";
import CardGenerator from "../../app/home/search/cardGenerator";
import FilterChips from "./FilterChips";

export default function SearchClient({ pageData }) {
    const [query, setQuery] = useState("");
    const [sortOrder, setSortOrder] = useState(null); // null | "asc" | "desc"
    const [filters, setFilters] = useState({
        authors: [],
        aspects: [],
        pageTypes: [],
        races: [],
    });

    const entries = Object.values(pageData.Response).flat();
    const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");

    const filtered = entries.filter(entry => {
        const nameMatch = !query.trim() ||
            normalize(entry.head.title).includes(normalize(query));

        const authorMatch = filters.authors.length === 0 ||
            filters.authors.includes(entry.head.author);

        const pageTypeMatch = filters.pageTypes.length === 0 ||
            filters.pageTypes.includes(entry.head.identity);

        const entryAspects = entry.head.aspects
            ? entry.head.aspects.map(a => a.name.replace(/\s*\(.*?\)$/, ""))
            : [];
        const aspectMatch = filters.aspects.length === 0 ||
            filters.aspects.some(a => entryAspects.includes(a));

        const normalizeRace = (r) => r?.toLowerCase().replace(/s$/, "") ?? "";
        const raceMatch = filters.races.length === 0 || filters.races.some(r => {
            const req = entry.head.raceReq;
            if (r === "Any Race") {
                // Match null, "Any", "Any Race", or any "Any Race (except X)" variant
                return !req || req === "Any" || /any race/i.test(req)
                    || entry.head.identity === "Race";
            }
            // Match Race-type entries by their title
            if (entry.head.identity === "Race") {
                return normalizeRace(entry.head.title) === normalizeRace(r);
            }
            // Split comma-separated raceReq and check each part
            return (req || "").split(",").map(p => p.trim())
                .some(p => normalizeRace(p) === normalizeRace(r));
        });

        return nameMatch && authorMatch && pageTypeMatch && aspectMatch && raceMatch;
    });

    const sorted = sortOrder
        ? [...filtered].sort((a, b) => {
            const cmp = a.head.title.localeCompare(b.head.title);
            return sortOrder === "asc" ? cmp : -cmp;
          })
        : filtered;

    return (
        <>
            <div className="flex gap-2">
                <SearchBar query={query} onSearch={setQuery} />
                <select
                    value={sortOrder ?? "null"}
                    onChange={(e) => setSortOrder(e.target.value === "null" ? null : e.target.value)}
                    className="shrink-0 w-auto px-2 py-1 mr-6 rounded-md text-xs border border-dbu-line bg-dbu-bg2 text-dbu-text focus:outline-none focus:border-dbu-header"
                >
                    <option value="null">Default</option>
                    <option value="asc">A→Z</option>
                    <option value="desc">Z→A</option>
                </select>
            </div>
            <FilterChips filters={filters} setFilters={setFilters} entries={entries} />
            <CardGenerator entries={sorted} />
        </>
    );
}