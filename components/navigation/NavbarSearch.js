"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function NavbarSearch({ fullWidth = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [allTitles, setAllTitles] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentPages, setRecentPages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentPages") || "[]");
      setRecentPages(stored);
    } catch {}
  }, []);

  const getSuggestions = () => {
    if (!query.trim() || !allTitles?.length) return [];
    const q = query.trim().toLowerCase();
    return allTitles
      .filter((t) => t.title.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(q);
        const bStarts = b.title.toLowerCase().startsWith(q);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.title.localeCompare(b.title);
      })
      .slice(0, 6);
  };

  const navigateTo = (keyName) => {
    router.push(`/${keyName}`);
    setOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  const getDropdownItems = () => {
    if (query.trim()) return getSuggestions();
    return recentPages;
  };

  const submit = async () => {
    const items = getDropdownItems();
    if (selectedIndex >= 0 && items[selectedIndex]) {
      navigateTo(items[selectedIndex].keyName);
      return;
    }
    const trimmed = query.trim();
    if (trimmed) {
      const res = await fetch(`/api/pages/exact-match?q=${encodeURIComponent(trimmed)}`);
      const { keyName } = await res.json();
      if (keyName) {
        navigateTo(keyName);
        return;
      }
    }
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`/search?${params.toString()}`);
    setOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    const items = getDropdownItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      submit();
    }
  };

  const isTyping = query.trim().length > 0;
  const suggestions = open && isTyping ? getSuggestions() : [];
  const showRecent = open && !isTyping && recentPages.length > 0;
  const showDropdown = suggestions.length > 0 || showRecent;
  const dropdownItems = isTyping ? suggestions : recentPages;

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
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            setOpen(true);
            try {
              const stored = JSON.parse(localStorage.getItem("recentPages") || "[]");
              setRecentPages(stored);
            } catch {}
            if (allTitles === null) {
              fetch("/api/pages/titles")
                .then((r) => r.json())
                .then(setAllTitles)
                .catch(() => setAllTitles([]));
            }
          }}
          onBlur={() => {
            setOpen(false);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className={`bg-transparent text-sm outline-none text-dbu-text placeholder-dbu-text/40 ${fullWidth ? "w-full" : "w-36"}`}
        />
      </div>

      {showDropdown && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-full mt-2 right-0 bg-dbu-bg2 border border-dbu-line rounded-xl p-4 z-50 w-80 shadow-2xl"
        >
          <p className="text-xs text-dbu-text/50 mb-1.5 uppercase tracking-wider">
            {showRecent ? "Recently Viewed" : "Pages"}
          </p>
          {dropdownItems.map((t, i) => (
            <button
              key={t.keyName}
              onMouseDown={() => navigateTo(t.keyName)}
              onMouseEnter={() => setSelectedIndex(i)}
              onMouseLeave={() => setSelectedIndex(-1)}
              className={`block w-full text-left px-2 py-1.5 text-sm text-dbu-text rounded transition-colors truncate ${
                i === selectedIndex ? "bg-dbu-line" : "hover:bg-dbu-line"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
