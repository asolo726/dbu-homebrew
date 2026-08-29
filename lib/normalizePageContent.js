function normalizeAddendumBox(box) {
  if (!box || typeof box !== "object") return box;

  return {
    boxTitle: box.boxTitle ?? "",
    title: box.title ?? "",
    desc: box.desc ?? "",
    abilities: Array.isArray(box.abilities)
      ? box.abilities.map(normalizeAbility)
      : [],
    traits: Array.isArray(box.traits)
      ? box.traits.map(normalizeTrait)
      : [],
  };
}

function normalizeAbility(item) {
  if (item == null) return item;

  if (Array.isArray(item)) {
    return item.map(normalizeAbility);
  }

  if (typeof item !== "object") return item;

  if ("effect" in item) {
    const normalizedEffect = normalizeAbility(item.effect);
    if (normalizedEffect && typeof normalizedEffect === "object") {
      return normalizedEffect;
    }
    return { condition: "", desc: String(normalizedEffect ?? "") };
  }

  if ("bullet" in item) {
    const normalizedBullet = normalizeAbility(item.bullet);
    if (normalizedBullet && typeof normalizedBullet === "object") {
      return {
        condition: normalizedBullet.condition ?? "",
        desc: normalizedBullet.desc ?? "",
      };
    }
    return { condition: "", desc: String(normalizedBullet ?? "") };
  }

  if ("list" in item) {
    const list = Array.isArray(item.list)
      ? item.list
          .map((entry) => {
            const normalizedEntry = normalizeAbility(entry);
            if (typeof normalizedEntry === "string") return normalizedEntry;
            if (normalizedEntry && typeof normalizedEntry === "object") {
              const condition = normalizedEntry.condition
                ? `${normalizedEntry.condition}: `
                : "";
              return `${condition}${normalizedEntry.desc ?? ""}`.trim();
            }
            return "";
          })
          .filter(Boolean)
      : [];
    return { list };
  }

  if ("miniTraitList" in item) {
    return {
      miniTraitList: Array.isArray(item.miniTraitList)
        ? item.miniTraitList.map(normalizeTrait)
        : [],
    };
  }

  if ("addendumBox" in item) {
    return {
      addendumBox: normalizeAddendumBox(item.addendumBox),
    };
  }

  if ("condition" in item || "desc" in item) {
    return {
      condition: item.condition ?? "",
      desc: item.desc ?? "",
    };
  }

  if ("title" in item || "name" in item) {
    return {
      title: item.title ?? item.name ?? "",
      desc: item.desc ?? "",
      abilities: Array.isArray(item.abilities)
        ? item.abilities.map(normalizeAbility)
        : [],
    };
  }

  return item;
}

function normalizeTrait(trait) {
  if (!trait || typeof trait !== "object") return trait;

  const normalized = {
    title: trait.title ?? "",
    desc: trait.desc ?? "",
    abilities: Array.isArray(trait.abilities)
      ? trait.abilities.map(normalizeAbility)
      : [],
  };

  if (trait.sectional) {
    normalized.sectional = {
      title: trait.sectional.title ?? "",
    };
  }

  if (Array.isArray(trait.traits)) {
    normalized.traits = trait.traits.map(normalizeTrait);
  }

  return normalized;
}

export function normalizePageContent(rawContent) {
  if (!rawContent || typeof rawContent !== "object") return rawContent;

  const normalized = { ...rawContent };
  normalized.data = rawContent.data ?? {};
  normalized.head = rawContent.head ?? {};
  normalized.head.details = rawContent.head?.details ?? {};

  normalized.data.author ??= normalized.head.author ?? rawContent.author ?? "";
  normalized.data.keyName ??= normalized.head.keyName ?? rawContent.keyName ?? "";
  normalized.data.identity ??= normalized.head.identity ?? rawContent.identity ?? "";
  normalized.data.management ??= normalized.head.management ?? {};
  normalized.data.credits ??= normalized.head.credits ?? {};
  normalized.head.banner ??= rawContent.banner ?? "";
  normalized.head.desc ??= rawContent.desc ?? "";
  normalized.head.title ??= rawContent.title ?? "";
  normalized.head.isCommunity ??= rawContent.isCommunity ?? false;
  normalized.head.details.stress ??= normalized.head.details.stressTest ?? rawContent.head?.stress ?? rawContent.stress ?? "";

  if (Array.isArray(rawContent.head?.aspects) && !Array.isArray(normalized.head.details.aspects)) {
    normalized.head.details.aspects = rawContent.head.aspects;
  }
  if (Array.isArray(rawContent.head?.attributes) && !Array.isArray(normalized.head.details.attributes)) {
    normalized.head.details.attributes = rawContent.head.attributes;
  }
  if (Array.isArray(rawContent.head?.attributeModifiers) && !Array.isArray(normalized.head.details.attributeModifiers)) {
    normalized.head.details.attributeModifiers = rawContent.head.attributeModifiers;
  }
  if (!Array.isArray(normalized.head.details.aspects) && Array.isArray(rawContent.aspects)) {
    normalized.head.details.aspects = rawContent.aspects;
  }
  if (!Array.isArray(normalized.head.details.attributeModifiers) && Array.isArray(rawContent.attributeModifiers)) {
    normalized.head.details.attributeModifiers = rawContent.attributeModifiers;
  }
  if (!Array.isArray(normalized.head.details.attributeModifiers) && Array.isArray(normalized.head.details.attributes)) {
    normalized.head.details.attributeModifiers = normalized.head.details.attributes.map((mod) => ({
      attribute: mod.attribute,
      Bonus: mod.bonus ?? mod.Bonus ?? 0,
      Multiplier: mod.multiplier ?? mod.Multiplier ?? "",
    }));
  }

  const bodySections = Array.isArray(rawContent.body) ? rawContent.body : [];
  const mappedTraits = [];
  const mappedMastery = [];
  const mappedLegendary = [];

  bodySections.forEach((entry) => {
    const section = entry?.section ?? entry;
    const sectionTitle = (section?.header ?? "").toUpperCase();
    const sectionTraits = Array.isArray(section?.traits)
      ? section.traits.map(normalizeTrait)
      : [];

    if (sectionTraits.length > 0) {
      if (sectionTitle.includes("MASTERY")) {
        mappedMastery.push(...sectionTraits);
      } else if (sectionTitle.includes("LEGENDARY")) {
        mappedLegendary.push(...sectionTraits);
      } else {
        mappedTraits.push(...sectionTraits);
      }
    }
  });

  normalized.traits ??= rawContent.traits ?? mappedTraits;
  normalized.masteryTrait ??= rawContent.masteryTrait ?? mappedMastery;
  normalized.legendaryTrait ??= rawContent.legendaryTrait ?? mappedLegendary;

  if (Array.isArray(normalized.traits)) {
    normalized.traits = normalized.traits.map((trait) => normalizeTrait(trait));
  }
  if (Array.isArray(normalized.masteryTrait)) {
    normalized.masteryTrait = normalized.masteryTrait.map((trait) => normalizeTrait(trait));
  }
  if (Array.isArray(normalized.legendaryTrait)) {
    normalized.legendaryTrait = normalized.legendaryTrait.map((trait) => normalizeTrait(trait));
  }

  if (Array.isArray(normalized.body) && normalized.body.length > 0 && normalized.traits.length === 0) {
    normalized.traits = mappedTraits;
  }

  return normalized;
}
