export class Aspect {
  constructor(name, isPositive, effects, maxLevel, isCustom) {
    this.name = name;
    this.isPositive = isPositive;
    this.effects = effects;
    this.maxLevel = maxLevel;
    this.isCustom = isCustom;
  }
}

export const getAspects = async () => {
  const response = await fetch("/api/getAspects");
  const data = await response.json();
  let aspects = [];
  aspects = [...data.positiveAspects, ...data.negativeAspects, ...data.customAspects];
  return aspects;
}