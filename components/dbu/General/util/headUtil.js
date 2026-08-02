"use client";
"use client";

let aspects = [];
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
                    ...data.customAspects
                ];

                aspectsLoaded = true;
                return aspects;
            });
    }

    return aspectsPromise;
}

export const getCustomAspectNames = () => aspects.filter((aspect) => aspect.isCustom).map((aspect) => aspect.name);

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