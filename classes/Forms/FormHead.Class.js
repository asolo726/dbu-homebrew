import Head from "../General Classes/head.Class";
class FormHead extends Head {
    constructor({
        title,
        banner = "/whosthatzfighter.webp",
        desc = "",
        author = "",
        raceReq = "None",
        preReq = "None",
        top = "1",
        aspects = [],
        attributeModifiers = [],
    } = {}) {
        super(title, banner, desc);
        this._author = author;
        this._raceReq = raceReq;
        this._preReq = preReq;
        this._top = top;
        this._aspects = aspects;
        this._attributeModifiers = attributeModifiers;
    }

    get author() {
        return this._author;
    }
    set author(value) {
        this._author = value;
    }
    get raceReq() {
        return this._raceReq;
    }
    set raceReq(value) {
        this._raceReq = value;
    }
    get preReq() {
        return this._preReq;
    }
    set preReq(value) {
        this._preReq = value;
    }
    get top() {
        return this._top;
    }
    set top(value) {
        this._top = value;
    }
    get aspects() {
        return this._aspects;
    }
    set aspects(value) {
        this._aspects = value;
    }
    get attributeModifiers() {
        return this._attributeModifiers;
    }
    set attributeModifiers(value) {
        this._attributeModifiers = value;
    }
}

export default FormHead;
