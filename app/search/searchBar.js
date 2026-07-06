"use client";

export default function SearchBar({ query, onSearch, onEnter, suggestions }) {
  return (
    <>
      <input
        type="text"
        list={suggestions?.length ? "page-title-suggestions" : undefined}
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        placeholder="Search..."
        className="w-full p-2 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text placeholder:text-dbu-text/40 focus:outline-none focus:border-dbu-header mr-4"
      />
      {suggestions?.length > 0 && (
        <datalist id="page-title-suggestions">
          {suggestions.map((title) => (
            <option key={title} value={title} />
          ))}
        </datalist>
      )}
    </>
  );
}
