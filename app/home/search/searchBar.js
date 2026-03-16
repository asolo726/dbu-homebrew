"use client";

export default function SearchBar({ query, onSearch }) {
    return (
        <input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text placeholder:text-dbu-text/40 focus:outline-none focus:border-dbu-header mr-4"
        />
    );
}