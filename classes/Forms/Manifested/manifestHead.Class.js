import FormHead from "../FormHead.Class";
class ManifestHead extends FormHead {
    constructor({
        title,
        banner,
        desc,
        author,
        raceReq,
        preReq,
        tier,
        aspects,
        attributeModifiers,
        maxStacks = 1,
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
        this._maxStacks = maxStacks;
    }

    get maxStacks() {
        return this._maxStacks;
    }

    set maxStacks(value) {
        this._maxStacks = value;
    }
}

export default ManifestHead;