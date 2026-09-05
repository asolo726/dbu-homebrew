/**
 * The purpose of this function is to preserve edits made to newly added traits. Without it, if the
 * user modifies the number of traits present (either by adding one or delete one), any other trait changes are wiped.
 */

export function resolvePendingValue(
	path: string,
	fallback: unknown,
	pendingChanges: Record<string, any>,
) {
	const base = pendingChanges[path] ?? fallback;
	const relatedChanges = Object.entries(pendingChanges)
		.filter(([key]) => key.startsWith(`${path}.`))
		.sort(([a], [b]) => a.split(".").length - b.split(".").length);

	if (relatedChanges.length === 0) return base;

	const result = JSON.parse(JSON.stringify(base));

	for (const [key, value] of relatedChanges) {
		const parts = key.slice(path.length + 1).split(".");
		let target = result;

		for (let index = 0; index < parts.length - 1; index++) {
			target =
				target[
					Number.isNaN(Number(parts[index]))
						? parts[index]
						: Number(parts[index])
				];

			if (target == null) break;
		}

		if (target == null) continue;

		const last = parts[parts.length - 1];
		target[Number.isNaN(Number(last)) ? last : Number(last)] = value;
	}

	return result;
}
