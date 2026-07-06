"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { BASE_RACES, PAGE_TYPES } from "../search/searchConstants";
import Chip from "../search/Chip";

export default function NavbarSearch({ fullWidth = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [pageTypes, setPageTypes] = useState([]);
  const [races, setRaces] = useState([]);
  const [allTitles, setAllTitles] = useState(null);
  const inputRef = useRef(null);

  const toggle = (list, setList, value) =>
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const submit = async () => {
    const trimmed = query.trim();
    if (trimmed) {
      const res = await fetch(`/api/pages/exact-match?q=${encodeURIComponent(trimmed)}`);
      const { keyName } = await res.json();
      if (keyName) {
        router.push(`/${keyName}`);
        setOpen(false);
        setQuery("");
        setPageTypes([]);
        setRaces([]);
        return;
      }
    }
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    if (pageTypes.length) params.set("pageTypes", pageTypes.join(","));
    if (races.length) params.set("races", races.join(","));
    router.push(`/search?${params.toString()}`);
    setOpen(false);
    setQuery("");
    setPageTypes([]);
    setRaces([]);
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <div
        className={`flex items-center gap-1 bg-neutral-700 rounded-md px-2 py-1 ${fullWidth ? "w-full" : ""}`}
      >
        <button
          onClick={submit}
          className="text-dbu-text/70 hover:text-dbu-text shrink-0 cursor-pointer"
        >
          <FiSearch size={14} />
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setOpen(true);
            if (allTitles === null) {
              fetch("/api/pages/titles")
                .then((r) => r.json())
                .then(setAllTitles)
                .catch(() => setAllTitles([]));
            }
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Search..."
          className={`bg-transparent text-sm outline-none text-dbu-text placeholder-dbu-text/40 ${fullWidth ? "w-full" : "w-36"}`}
        />
      </div>

      {open && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-full mt-2 right-0 bg-dbu-bg2 border border-dbu-line rounded-xl p-4 z-50 w-80 shadow-2xl"
        >
          {query.trim() && allTitles?.length > 0 && (() => {
            const q = query.trim().toLowerCase();
            const suggestions = allTitles
              .filter((t) => t.title.toLowerCase().includes(q))
              .slice(0, 6);
            return suggestions.length > 0 ? (
              <div className="mb-4">
                <p className="text-xs text-dbu-text/50 mb-1.5 uppercase tracking-wider">Pages</p>
                {suggestions.map((t) => (
                  <button
                    key={t.keyName}
                    onMouseDown={() => {
                      router.push(`/${t.keyName}`);
                      setOpen(false);
                      setQuery("");
                      setPageTypes([]);
                      setRaces([]);
                    }}
                    className="block w-full text-left px-2 py-1.5 text-sm text-dbu-text hover:bg-dbu-line rounded transition-colors truncate"
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            ) : null;
          })()}
          <p className="text-xs text-dbu-text/50 mb-2 uppercase tracking-wider">
            Type
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.entries(PAGE_TYPES).map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                active={pageTypes.includes(key)}
                onMouseDown={() => toggle(pageTypes, setPageTypes, key)}
                className="px-2 py-0.5"
              />
            ))}
          </div>
          <p className="text-xs text-dbu-text/50 mb-2 uppercase tracking-wider">
            Race
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            {["Any Race", ...BASE_RACES].map((r) => (
              <Chip
                key={r}
                label={r}
                active={races.includes(r)}
                onMouseDown={() => toggle(races, setRaces, r)}
                className="px-2 py-0.5"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
