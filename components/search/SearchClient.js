"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "../../app/search/searchBar";
import CardGenerator from "../../app/search/cardGenerator";
import FilterChips from "./FilterChips";
import { Tooltip } from "react-tooltip";

export default function SearchClient({ pageData }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [sortOrder, setSortOrder] = useState(searchParams.get("sort") ?? null);
    const [filters, setFilters] = useState({
        authors:   searchParams.get("authors")?.split(",").filter(Boolean)   ?? [],
        aspects:   searchParams.get("aspects")?.split(",").filter(Boolean)   ?? [],
        pageTypes: searchParams.get("pageTypes")?.split(",").filter(Boolean) ?? [],
        races:     searchParams.get("races")?.split(",").filter(Boolean)     ?? [],
        tags:      searchParams.get("tags")?.split(",").filter(Boolean)      ?? [],
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (query)                  params.set("q",         query);
        if (sortOrder)              params.set("sort",       sortOrder);
        if (filters.authors.length)   params.set("authors",   filters.authors.join(","));
        if (filters.aspects.length)   params.set("aspects",   filters.aspects.join(","));
        if (filters.pageTypes.length) params.set("pageTypes", filters.pageTypes.join(","));
        if (filters.races.length)     params.set("races",     filters.races.join(","));
        if (filters.tags.length)      params.set("tags",      filters.tags.join(","));
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [query, sortOrder, filters]);

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

        const tagMatch = filters.tags.length === 0 ||
            filters.tags.some(t => entry.head.tag?.includes(t));

        return nameMatch && authorMatch && pageTypeMatch && aspectMatch && raceMatch && tagMatch;
    });

    const sorted = sortOrder
        ? [...filtered].sort((a, b) => {
            const cmp = a.head.title.localeCompare(b.head.title);
            return sortOrder === "asc" ? cmp : -cmp;
          })
        : filtered;

    const clearAll = () => {
        setQuery("");
        setSortOrder(null);
        setFilters({ authors: [], aspects: [], pageTypes: [], races: [], tags: [] });
    };

    return (
        <>
            <div className="flex gap-2">
                <SearchBar query={query} onSearch={setQuery} />
                <button
                    onClick={clearAll}
                    data-tooltip-id="clear-tooltip"
                    data-tooltip-content="Clear all filters and search"
                    className="shrink-0 px-3 py-1 rounded-md text-xs border border-dbu-line bg-dbu-bg2 text-dbu-text hover:border-dbu-header transition-all active:scale-90 active:bg-dbu-bg3"
                >
                    Clear
                </button>
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
            <Tooltip
                id="clear-tooltip"
                className="tooltip"
            />
        </>
    );
}