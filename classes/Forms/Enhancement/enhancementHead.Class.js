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
        enhancementType, // Standard or Special
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
        this._enhancementType = enhancementType;
        this._stress = stress;
    }

    get stress() {
        return this._stress;
    }
    set stress(value) {
        this._stress = value;
    }

    get enhancementType() {
        return this._enhancementType;
    }

    set enhancementType(value) {
        this._enhancementType = value;
    }
}

export default EnhancementHead;