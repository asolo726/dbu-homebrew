class EvolvedStage {
  constructor({ head, traits = [], masteryTrait, legendaryTrait } = {}) {
    this._head = head;
    this._traits = traits;
    this._masteryTrait = masteryTrait;
    this._legendaryTrait = legendaryTrait;
  }

  get head() {
    return this._head;
  }
  set head(value) {
    this._head = value;
  }

  get traits() {
    return this._traits;
  }
  set traits(value) {
    this._traits = value;
  }

  get masteryTrait() {
    return this._masteryTrait;
  }
  set masteryTrait(value) {
    this._masteryTrait = value;
  }

  get legendaryTrait() {
    return this._legendaryTrait;
  }
  set legendaryTrait(value) {
    this._legendaryTrait = value;
  }
}

export default EvolvedStage;
