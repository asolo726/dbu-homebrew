"use client";
import { BASE_RACES, PAGE_TYPES } from "./searchConstants";

// Strip trailing 's' for plural-insensitive comparison
const normalizeRace = (r) => r?.toLowerCase().replace(/s$/, "") ?? "";

function Chip({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                active
                    ? "bg-dbu-header text-dbu-bg border-dbu-header font-semibold"
                    : "bg-transparent text-dbu-text/70 border-dbu-line hover:border-dbu-text/50"
            }`}
        >
            {label}
        </button>
    );
}

function FilterGroup({ label, items, category, filters, onToggle, displayMap }) {
    if (items.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-dbu-text/50 text-xs shrink-0">{label}:</span>
            {items.map(item => (
                <Chip
                    key={item}
                    label={displayMap ? displayMap[item] : item}
                    active={filters[category].includes(item)}
                    onClick={() => onToggle(category, item)}
                />
            ))}
        </div>
    );
}

export default function FilterChips({ filters, setFilters, entries }) {
    const authors = [...new Set(entries.map(e => e.head.author).filter(Boolean))].sort();

    const aspectSet = new Set();
    entries.forEach(e => {
        e.head.aspects?.forEach(a => aspectSet.add(a.name.replace(/\s*\(.*?\)$/, "")));
    });
    const aspects = [...aspectSet].sort();

    const dynamicRaces = [];
    entries.forEach(e => {
        // Add Race-type entries by title (e.g. Basakejin, Namekian)
        if (e.head.identity === "Race") {
            dynamicRaces.push(e.head.title);
            return;
        }
        const req = e.head.raceReq;
        if (!req || req === "Any" || req === "Any Race") return;
        if (/any race/i.test(req)) return; // skip "Any Race (except X)" variants
        // Split comma-separated values and check each part
        req.split(",").map(r => r.trim()).forEach(part => {
            if (!BASE_RACES.some(b => normalizeRace(b) === normalizeRace(part))) {
                dynamicRaces.push(part);
            }
        });
    });
    const races = ["Any Race", ...[...new Set([...BASE_RACES, ...dynamicRaces])].sort()];

    const tags = [...new Set(entries.flatMap(e => e.head.tag ?? []))].sort();

    const toggle = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            return {
                ...prev,
                [category]: current.includes(value)
                    ? current.filter(v => v !== value)
                    : [...current, value],
            };
        });
    };

    return (
        <div className="flex flex-col gap-3 mt-3 p-3 rounded-lg bg-dbu-bg2 border border-dbu-line">
            <FilterGroup label="Type"    items={Object.keys(PAGE_TYPES)} category="pageTypes" filters={filters} onToggle={toggle} displayMap={PAGE_TYPES} />
            <FilterGroup label="Author"  items={authors}                  category="authors"   filters={filters} onToggle={toggle} />
            <FilterGroup label="Aspects" items={aspects}                  category="aspects"   filters={filters} onToggle={toggle} />
            <FilterGroup label="Race"    items={races}                    category="races"     filters={filters} onToggle={toggle} />
            <FilterGroup label="Tags"    items={tags}                     category="tags"      filters={filters} onToggle={toggle} />
        </div>
    );
}
