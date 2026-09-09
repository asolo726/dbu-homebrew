"use client";
import { BASE_RACES, PAGE_TYPES } from "./searchConstants";
import Chip from "./Chip";

// Strip trailing 's' for plural-insensitive comparison
const normalizeRace = (r) => r?.toLowerCase().replace(/s$/, "") ?? "";

function FilterGroup({
	label,
	items,
	category,
	filters,
	onToggle,
	displayMap,
}) {
	if (items.length === 0) return null;
	return (
		<div className="flex flex-wrap gap-2 items-center">
			<span className="text-dbu-text/50 text-xs shrink-0">{label}:</span>
			{items.map((item) => (
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
	const safeEntry = (entry) => {
		const data = entry?.data ?? {};
		const head = entry?.head ?? {};
		const details = data?.details ?? head?.details ?? {};

		return {
			data,
			head,
			details,
			author: data?.author ?? head?.author ?? "",
			identity: data?.identity ?? head?.identity ?? "",
			title: head?.title ?? data?.title ?? "",
			tag: data?.tag || head?.tag || "",
			raceReq: details?.raceReq ?? head?.raceReq ?? data?.raceReq ?? "",
			aspects: Array.isArray(details?.aspects)
				? details.aspects
				: Array.isArray(head?.aspects)
					? head.aspects
					: [],
		};
	};

	const authors = [
		...new Set(entries.map((e) => safeEntry(e).author).filter(Boolean)),
	].sort();

	const aspectSet = new Set();
	entries.forEach((entry) => {
		const { aspects } = safeEntry(entry);
		aspects.forEach((a) => {
			const name =
				typeof a === "string" ? a : (a?.name ?? a?.title ?? "");
			if (name) aspectSet.add(name.replace(/\s*\(.*?\)$/, ""));
		});
	});
	const aspects = [...aspectSet].sort();

	const dynamicRaces = [];
	entries.forEach((entry) => {
		const { identity, title, raceReq } = safeEntry(entry);
		if (identity === "Race") {
			dynamicRaces.push(title);
			return;
		}
		if (!raceReq || raceReq === "Any" || raceReq === "Any Race") return;
		if (/any race/i.test(raceReq)) return;
		raceReq
			.split(",")
			.map((r) => r.trim())
			.forEach((part) => {
				if (
					!BASE_RACES.some(
						(b) => normalizeRace(b) === normalizeRace(part),
					)
				) {
					dynamicRaces.push(part);
				}
			});
	});
	const races = [
		"Any Race",
		...[...new Set([...BASE_RACES, ...dynamicRaces])].sort(),
	];

	const tags = [
		...new Set(
			entries
				.flatMap((entry) => {
					const tag = safeEntry(entry).tag;
					if (!tag) return [];
					return Array.isArray(tag) ? tag : [String(tag)];
				})
				.filter(Boolean),
		),
	].sort();

	const toggle = (category, value) => {
		setFilters((prev) => {
			const current = prev[category];
			return {
				...prev,
				[category]: current.includes(value)
					? current.filter((v) => v !== value)
					: [...current, value],
			};
		});
	};

	return (
		<div className="flex flex-col gap-3 mt-3 p-3 rounded-lg bg-dbu-bg2 border border-dbu-line">
			<FilterGroup
				label="Type"
				items={Object.keys(PAGE_TYPES)}
				category="pageTypes"
				filters={filters}
				onToggle={toggle}
				displayMap={PAGE_TYPES}
			/>
			<FilterGroup
				label="Author"
				items={authors}
				category="authors"
				filters={filters}
				onToggle={toggle}
			/>
			<FilterGroup
				label="Aspects"
				items={aspects}
				category="aspects"
				filters={filters}
				onToggle={toggle}
			/>
			<FilterGroup
				label="Race"
				items={races}
				category="races"
				filters={filters}
				onToggle={toggle}
			/>
			<FilterGroup
				label="Tags"
				items={tags}
				category="tags"
				filters={filters}
				onToggle={toggle}
			/>
		</div>
	);
}
