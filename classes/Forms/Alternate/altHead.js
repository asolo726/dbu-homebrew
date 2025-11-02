import FormHead from "../../Forms/FormHead";
class AlternateHead extends FormHead {
    constructor({
        title,
        banner = "",
        desc = "",
        author = "",
        raceReq = "None",
        preReq = "None",
        top = "1",
        aspects = [],
        attributeModifiers = [],
        stress = "1",
        transLine = "",
        transStage = "",
    } = {}) {
        super(
            title,
            banner,
            desc,
            author,
            raceReq,
            preReq,
            top,
            aspects,
            attributeModifiers
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
