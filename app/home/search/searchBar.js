"use client";
import { useState } from "react";

export default function SearchBar() {
    const [searchInput, setSearchInput] = useState('');

    return (
        <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text placeholder:text-dbu-text/40 focus:outline-none focus:border-dbu-header"
        />
    );
}