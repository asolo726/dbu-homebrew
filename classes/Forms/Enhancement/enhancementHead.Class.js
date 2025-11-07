import FormHead from "../FormHead.Class";
class EnhancementHead extends FormHead {
    constructor({
        title,
        banner,
        desc,
        author,
        raceReq ,
        preReq ,
        tier,
        aspects = [],
        attributeModifiers = [],
        stress = 0,
    } = {}) {
        super({
            title: title,
            banner: banner,
            desc: desc,
            author: author,
            raceReq: raceReq,
            preReq: preReq,
            tier: tier,
            aspects: aspects,
            attributeModifiers: attributeModifiers
        });
        this._stress = stress;
    }

    get stress() {
        return this._stress;
    }
    set stress(value) {
        this._stress = value;
    }
}

export default EnhancementHead;