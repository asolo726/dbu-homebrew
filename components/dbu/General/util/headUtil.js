// Gets aspects from the database.
const getAspects = async () => {
  const response = await fetch("/api/getAspects");
  const data = await response.json();
  let aspects = [];
  aspects = [...data.positiveAspects, ...data.negativeAspects, ...data.customAspects];
  return aspects;
}

// We can fetch aspects once and reuse them for tooltips to avoid multiple network requests.
const aspects = await getAspects();

// We get custom aspects to determine if we should italicize the aspect name on the page.
export const customAspectNames = aspects.filter((aspect) => aspect.isCustom).map((aspect) => aspect.name);

// Handles the special tooltip for aspects when a user hovers over an aspect name.
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
  }
  catch (e) {
    console.log("error loading aspect tooltip for: ", cleanName);
  }
};

// Allows users to upload an image and set the banner URL in the head object.
export async function handleImageUpload(file) {
    if (!file || !setChange) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploadImage", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setChange("head.banner", data.url);
    } finally {
      setUploading(false);
    }
}