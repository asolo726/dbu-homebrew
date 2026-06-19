import FormHead from "../FormHead.Class";
class EnhancementHead extends FormHead {
  constructor({
    title,
    banner,
    desc,
    bannerAuthor,
    author,
    raceReq,
    preReq,
    tier,
    aspects = [],
    attributeModifiers = [],
    transformationType = "Enhancement Power",
    enhancementType, // Standard or Special
    initialEnhancement, // Only for Special Enhancements. If present, always contains an array of 2 elements
    stress = 0,
    identity = "Enhancement"
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
    this._enhancementType = enhancementType;
    this._initialEnhancement = initialEnhancement;
    this._stress = stress;
  }

  get stress() {
    return this._stress;
  }
  set stress(value) {
    this._stress = value;
  }

  get enhancementType() {
    return this._enhancementType;
  }

  set enhancementType(value) {
    this._enhancementType = value;
  }

  get initialEnhancement() {
    return this._initialEnhancement;
  }

  set initialEnhancement(value) {
    this._initialEnhancement = value;
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
      enhancementType: this._enhancementType,
      initialEnhancement: this._initialEnhancement,
      stress: this._stress,
      keyName: this._keyName,
      identity: this._identity
    }
  }
}

export default EnhancementHead;
