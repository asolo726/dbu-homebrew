class MasteryTrait {
  constructor(title, desc, abilities, tables) {
    this._title = title;
    this._desc = desc;
    this._abilities = abilities;
    this._tables = tables;
  }

  get title() {
    return this._title;
  }
  get desc() {
    return this._desc;
  }
  get abilities() {
    return this._abilities;
  }
  set title(value) {
    this._title = value;
  }
  set desc(value) {
    this._desc = value;
  }
  set ability(value) {
    this._abilities = value;
  }

  get tables() {
    return this._tables;
  }
  set tables(value) {
    this._tables = value;
  }
}

export default MasteryTrait;
