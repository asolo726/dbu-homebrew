export class Aspect {
  constructor(name, isPositive, effects, maxLevel, isCustom) {
    this.name = name;
    this.isPositive = isPositive;
    this.effects = effects;
    this.maxLevel = maxLevel;
    this.isCustom = isCustom;
  }
}

const getCustomAspects = async () => {
  const searchResult = await fetch("/api/searchContent");
  const data = await searchResult.json();
  const traits = data.content[0].head.traits;
  console.log("Traits:", traits);
  let customAspects = [];
  // The first set of aspects that will be iterated through are positive.
  // We'll know we've reached the negative aspects when we hit the negative aspect sectional.
  if (traits?.length > 0) {
    let aspectType = true; // true for positive, false for negative
    traits.forEach((trait) => {
      if (trait.sectional && trait.sectional.toLowerCase() === "negative aspects") {
        aspectType = false;
        return;
      } else {
        customAspects.push(
          new Aspect(
            trait.title,
            aspectType,
            trait.abilities.desc,
            0,
            true
          )
        )
      }
    })
  }
  return customAspects;
}

export const getAspects = async () => {
  const response = await fetch("/api/getAspects");
  const data = await response.json();
  let aspects = [];
  const basePositiveAspects = data.positiveAspects.map((aspect) =>
      new Aspect(
        aspect.name, 
        true, 
        aspect.effects, 
        aspect.maxLevel ? aspect.maxLevel : 0,
        false
      )
  );
  const baseNegativeAspects = data.negativeAspects.map((aspect) => 
      new Aspect(
        aspect.name, 
        false, 
        aspect.effects, 
        aspect.maxLevel ? aspect.maxLevel : 0,
        aspect.isCustom
      )
  );
  const customAspects = await getCustomAspects();
  aspects = [...basePositiveAspects, ...baseNegativeAspects, ...customAspects];
  return aspects;
}