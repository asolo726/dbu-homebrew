class MasteryTrait {
    constructor(title, desc, abilities) {
        this._title = title;
        this._desc = desc;
        this._ability = abilities;
    }

    get title() { return this._title; }
    get desc() { return this._desc; }
    get ability() { return this._ability; }
    set title(value) { this._title = value; }
    set desc(value) { this._desc = value; }
    set ability(value) { this._ability = value; }
}

export default MasteryTrait;