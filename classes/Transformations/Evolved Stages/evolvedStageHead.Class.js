import FormHead from "../FormHead.Class";
class EvolvedStageHead extends FormHead {
  constructor({
    title,
    banner,
    desc,
    author,
    bannerAuthor,
    raceReq = null,
    preReq,
    tier,
    aspects,
    attributeModifiers,
    stress = "1",
    evolvedStageType,
    transformationType = "Form",
    formType,
    identity = "EvolvedStage"
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
    this._evolvedStageType = evolvedStageType,
    this._stress = stress,
    this._formType = formType;
  }

  get evolvedStageType() {
    return this._evolvedStageType;
  }

  set evolvedStageType(value) {
    this._evolvedStageType = value;
  }

  get stress() {
    return this._stress;
  }

  set stress(value) {
    this._stress = value;
  }

  set formType(value) {
    this._formType = value;
  }

  get formType() {
    return this._formType;
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
      formType: this._formType,
      identity: this._identity,
      stress: this._stress,
      evolvedStageType: this._evolvedStageType,
      keyName: this._keyName
    }
  }
}

export default EvolvedStageHead;
