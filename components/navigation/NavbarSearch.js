"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { BASE_RACES, PAGE_TYPES } from "../search/searchConstants";

function Chip({ label, active, onMouseDown }) {
  return (
    <button
      onMouseDown={onMouseDown}
      className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
        active
          ? "bg-dbu-header text-dbu-bg border-dbu-header font-semibold"
          : "border-dbu-line text-dbu-text hover:border-dbu-header"
      }`}
    >
      {label}
    </button>
  );
}

export default function NavbarSearch({ fullWidth = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [pageTypes, setPageTypes] = useState([]);
  const [races, setRaces] = useState([]);
  const inputRef = useRef(null);

  const toggle = (list, setList, value) =>
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const submit = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
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
          className="text-dbu-text/70 hover:text-dbu-text shrink-0"
        >
          <FiSearch size={14} />
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
