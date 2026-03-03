class RaceFeatures {
  constructor(
    racialLifeModifier,
    savingThrows,
    skillRanks,
    attributeMod,
    minionSize,
    availableFactors,
  ) {
    this._racialLifeModifier = racialLifeModifier;
    this._savingThrows = savingThrows;
    this._skillRanks = skillRanks;
    this._attributeMod = attributeMod;
    this._minionSize = minionSize;
    this._availableFactors = availableFactors;
  }

  get racialLifeModifier() {
    return this._racialLifeModifier;
  }
  get savingThrows() {
    return this._savingThrows;
  }
  get skillRanks() {
    return this._skillRanks;
  }
  get attributeMod() {
    return this._attributeMod;
  }
  get minionSize() {
    return this._minionSize;
  }
  get availableFactors() {
    return this._availableFactors;
  }

  set racialLifeModifier(value) {
    this._racialLifeModifier = value;
  }
  set savingThrows(value) {
    this._savingThrows = value;
  }
  set skillRanks(value) {
    this._skillRanks = value;
  }
  set attributeMod(value) {
    this._attributeMod = value;
  }
  set minionSize(value) {
    this._minionSize = value;
  }
  set availableFactors(value) {
    this._availableFactors = value;
  }
}

export default RaceFeatures;
