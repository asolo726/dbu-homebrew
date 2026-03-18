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
    });
    ((this.evolvedStageType = evolvedStageType),
      (this._stress = stress),
      (this._formType = formType));
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
}

export default EvolvedStageHead;
