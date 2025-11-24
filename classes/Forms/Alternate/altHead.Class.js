import FormHead from "../FormHead.Class";
class AlternateHead extends FormHead {
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
        stress = "1",
        transLine = "",
        transStage = "",
        type = "Alternate Form"
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
            type: type
        });
        this._stress = stress;
        this._transLine = transLine;
        this._transStage = transStage;
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
    
}

export default AlternateHead;
