import FormHead from "../FormHead.Class";
class AwakeningHead extends FormHead {
  constructor({
    title,
    banner,
    desc,
    author,
    bannerAuthor,
    raceReq,
    preReq,
    tier,
    aspects,
    attributeModifiers,
    maxStacks = 1,
    awakeningType, // Lesser, Greater, or Super
    awakeningOrigin, // Body or Mind
    transformationType = "Awakening",
    identity = "Awakening"
  } = {}) {
    super({
      title: title,
      banner: banner,
      desc: desc,
      bannerAuthor: bannerAuthor,
      author: author,
      raceReq: raceReq,
      preReq: preReq,
      tier: tier,
      aspects: aspects,
      attributeModifiers: attributeModifiers,
      transformationType: transformationType,
      identity: identity
    });
    ((this._maxStacks = maxStacks),
      (this._awakeningType = awakeningType),
      (this._awakeningOrigin = awakeningOrigin));
  }

  get maxStacks() {
    return this._maxStacks;
  }

  set maxStacks(value) {
    this._maxStacks = value;
  }

  get awakeningType() {
    return this._awakeningType;
  }

  set awakeningType(value) {
    this._awakeningType = value;
  }

  get awakeningOrigin() {
    return this._awakeningOrigin;
  }

  set awakeningOrigin(value) {
    this._awakeningOrigin = value;
  }

  toJson(){
    return{
      title: this._title,
      banner: this._banner,
      desc: this._desc,
      bannerAuthor: this._bannerAuthor,
      author: this._author,
      raceReq: this._raceReq,
      preReq: this._preReq,
      tier: this._tier,
      aspects: this._aspects,
      attributeModifiers: this._attributeModifiers,
      transformationType: this._transformationType,
      identity: this._identity,
      maxStacks: this._maxStacks,
      awakeningType: this._awakeningType,
      awakeningOrigin: this._awakeningOrigin,
      keyName: this._keyName
    }
  }
}

export default AwakeningHead;
