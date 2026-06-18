import FormHead from "../FormHead.Class";
class LegendaryHead extends FormHead {
  constructor({
    title,
    banner,
    desc,
    bannerAuthor,
    author,
    raceReq,
    preReq,
    tier,
    aspects,
    attributeModifiers,
    stress = "1",
    transLine = "",
    transStage = "",
    transformationType = "Legendary Form",
    formType = "Transformation",
    identity = "Legendary"
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
    this._stress = stress;
    this._transLine = transLine;
    this._transStage = transStage;
    this._formType = formType;
  }

  get stress() {
    return this._stress;
  }

  get transLine() {
    return this._transLine;
  }

  get transStage() {
    return this._transStage;
  }

  set stress(value) {
    this._stress = value;
  }

  set transLine(value) {
    this._transLine = value;
  }

  set transStage(value) {
    this._transStage = value;
  }

  set formType(value) {
    this._formType = value;
  }

  get formType() {
    return this._formType;
  }

  toJson() {
    return {
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
      formType: this._formType,
      identity: this._identity,
      stress: this._stress,
      transLine: this._transLine,
      transStage: this._transStage,
      keyName: this._keyName
    };
  }
}

export default LegendaryHead;
