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
}

export default LegendaryHead;
