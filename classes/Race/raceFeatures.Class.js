class RaceFeatures {
  constructor(
    racialLifeModifier,
    savingThrows,
    skillRanks,
    attributeScores,
    minionSize,
    availableFactors,
  ) {
    this._racialLifeModifier = racialLifeModifier;
    this._savingThrows = savingThrows;
    this._skillRanks = skillRanks;
    this._attributeScores = attributeScores;
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
  get attributeScores() {
    return this._attributeScores;
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
  set attributeScores(value) {
    this._attributeScores = value;
  }
  set minionSize(value) {
    this._minionSize = value;
  }
  set availableFactors(value) {
    this._availableFactors = value;
  }
}

export default RaceFeatures;
