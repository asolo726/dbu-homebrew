class MasteryTrait {
    constructor(title, desc, abilities) {
        this._title = title;
        this._desc = desc;
        this._abilities = abilities;
    }

    get title() { return this._title; }
    get desc() { return this._desc; }
    get abilities() { return this._abilities; }
    set title(value) { this._title = value; }
    set desc(value) { this._desc = value; }
    set ability(value) { this._abilities = value; }
}

export default MasteryTrait;