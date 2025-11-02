import FormHead from "../FormHead.Class";
class AlternateHead extends FormHead {
    constructor({
        title,
        banner,
        desc,
        author,
        raceReq,
        preReq,
        top,
        aspects,
        attributeModifiers,
        stress = "1",
        transLine = "",
        transStage = "",
    } = {}) {
        super({
            title: title,
            banner: banner,
            desc: desc,
            author: author,
            raceReq: raceReq,
            preReq: preReq,
            top: top,
            aspects: aspects,
            attributeModifiers: attributeModifiers}
        );
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
