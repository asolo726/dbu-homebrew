export let aspects = [];
let aspectsLoaded = false;
let aspectsPromise = null;

export async function loadAspects() {
	if (aspectsLoaded) return aspects;

	if (!aspectsPromise) {
		aspectsPromise = fetch("/api/getAspects")
			.then((res) => res.json())
			.then((data) => {
				aspects = [
					...data.positiveAspects,
					...data.negativeAspects,
					...data.customAspects,
				];

				aspectsLoaded = true;
				return aspects;
			});
	}
	return aspectsPromise;
}

export const getCustomAspectNames = () =>
	aspects.filter((aspect) => aspect.isCustom).map((aspect) => aspect.name);

export const getAspectTooltip = (aspectName) => {
	const cleanName = aspectName.replace(/\s*\(.*?\)$/, "");
	const aspectInfo = aspects.find((a) => a.name === cleanName);
	try {
		//console.log("Aspect Info:", aspectInfo);
		const textColorClass = aspectInfo.isPositive
			? "text-dbu-pos-aspect"
			: "text-dbu-neg-aspect";

		return `<div class="p-3">
    <div class="text-lg font-bold ${textColorClass} mb-1">
      ${cleanName}
    </div>
    <div class="italic text-sm mb-2 text-gray-300">
      ${aspectInfo.isPositive ? "Positive" : "Negative"} Aspect
    </div>
    <div class="text-sm leading-relaxed text-gray-100">
      ${aspectInfo.effects?.replace(/\\n/g, "<br>")}
    </div>
  </div>`;
	} catch (e) {
		console.log("error loading aspect tooltip for: ", cleanName);
	}
};
/**
 * This only works with the loaded Aspects array, NOT aspects the user can edit
 * Returns a sorted array of aspects.
 * Positive Aspects are returned first, in alphabetical order, followed by negative aspects, also in alphabetical order.
 * @param {*} aspects
 * @returns []
 */
export const prettifyAspects = (aspects) => {
	const positiveAspects = aspects.filter((a) => a.isPositive);
	const negativeAspects = aspects.filter((a) => !a.isPositive);
	const sortedPositiveAspects = positiveAspects.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
	);
	const sortedNegativeAspects = negativeAspects.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
	);
	return [...sortedPositiveAspects, ...sortedNegativeAspects];
};

/**
 * Calls teh load aspect function above to cross reference the aspects parameter with the aspects in the database
 * To see if they're positive or not. Then places positive elements first, followed by negative elements
 * @param {*} aspects array
 * @returns sortedAspects[...positiveAspects, ...negativeAspects]
 */
export const sortEditableAspects = async (aspects) => {
	const loadedAspects = await loadAspects().then((res) => {
		const positiveAspects = res.filter((a) => a.isPositive);
		const negativeAspects = res.filter((a) => !a.isPositive);
		return { posAsp: positiveAspects, negAsp: negativeAspects };
	});
	const positiveAspectsHalf = aspects.filter((a) => {
		for (const positiveAspect of loadedAspects.posAsp) {
			if (a.name === positiveAspect.name) {
				return a;
			}
		}
	});
	const negativeAspectsHalf = aspects.filter((a) => {
		for (const negativeAspect of loadedAspects.negAsp) {
			if (a.name === negativeAspect.name) {
				return a;
			}
		}
	});

	positiveAspectsHalf.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
	);
	negativeAspectsHalf.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
	);
	const sortedAspects = [...positiveAspectsHalf, ...negativeAspectsHalf];

	return sortedAspects;
};

// This returns the value for the
// • Transformation Type: <value>
// listing on the header. We use the identity value to determine this.

export const formatTransformationType = (identity) => {
	if (identity === "Alternate" || identity === "Legendary") {
		return "Form";
	}
	return identity;
};
