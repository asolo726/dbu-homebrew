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

// Returns a sorted array of aspects.
// Positive Aspects are returned first, in alphabetical order, followed by negative aspects, also in alphabetical order.
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

// This returns the value for the
// • Transformation Type: <value>
// listing on the header. We use the identity value to determine this.

export const formatTransformationType = (identity) => {
  if (identity === "Alternate" || identity === "Legendary") {
    return "Form";
  }
  return identity;
  
}
