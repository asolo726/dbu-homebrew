class Legendary {
  constructor(
    head,
    traits = [],
    masteryTrait =[],
    legendaryTrait = [],
    transformations = [],
  ) {
    this._head = head;
    this._traits = traits;
    this._masteryTrait = masteryTrait;
    this._legendaryTrait = legendaryTrait;
    this._transformations = transformations;
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

  get transformations() {
    return this._transformations;
  }
  set transformations(value) {
    this._transformations = value;
  }

  toJson() {
    return {
      head: this._head.toJson(),
      traits: this._traits.map(trait => trait.toJson()),
      masteryTrait: this._masteryTrait.map(trait => trait.toJson()),
      legendaryTrait: this._legendaryTrait.map(trait => trait.toJson()),
      transformations: this._transformations.map(trait => trait.toJson()),
    };
  }
}

export default Legendary;
