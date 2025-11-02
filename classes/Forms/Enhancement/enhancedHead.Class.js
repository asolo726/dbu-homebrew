class EnhancedHead extends FormHead {
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
        stress = [],
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
    }

    get stress() {
        return this._stress;
    }
    set stress(value) {
        this._stress = value;
    }
}
