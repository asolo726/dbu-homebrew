import FormHead from "../FormHead.Class";
class EnhancementHead extends FormHead {
    constructor({
        title,
        banner,
        desc,
        bannerAuthor,
        author,
        raceReq ,
        preReq ,
        tier,
        aspects = [],
        attributeModifiers = [],
        type = "Enhancement Power",
        stress = 0,
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
    }

    get stress() {
        return this._stress;
    }
    set stress(value) {
        this._stress = value;
    }
}

export default EnhancementHead;