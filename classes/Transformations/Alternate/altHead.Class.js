import FormHead from "../FormHead.Class";
class AlternateHead extends FormHead {
  constructor({
    title,
    banner,
    desc,
    author,
    authorID,
    bannerAuthor,
    raceReq,
    preReq,
    tier,
    aspects,
    attributeModifiers,
    stress = "1",
    transLine = "",
    transStage = "",
    transformationType = "Form",
    formType = "Alternate",
    identity = "Alternate"
  } = {}) {
    super({
      title: title,
      banner: banner,
      desc: desc,
      author: author,
      authorID: authorID,
      bannerAuthor: bannerAuthor,
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

  set stress(value) {
    this._stress = value;
  }
  get stress() {
    return this._stress;
  }
  set transLine(value) {
    this._transLine = value;
  }
  get transLine() {
    return this._transLine;
  }
  set transStage(value) {
    this._transStage = value;
  }
  get transStage() {
    return this._transStage;
  }

  set formType(value) {
    this._formType = value;
  }
  get formType() {
    return this._formType;
  }

  toJson() {
    return{
      title: this._title,
      banner: this._banner,
      desc: this._desc,
      author: this._author,
      authorID: this._authorID,
      bannerAuthor: this._bannerAuthor,
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
    }
  }
}

export default AlternateHead;
