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
        type = "Legendary Form"
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
}

export default LegendaryHead;