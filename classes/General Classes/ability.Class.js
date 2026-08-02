class Ability {
  constructor(abilityList = [{}]) {
    this._abilityList = abilityList;
  }

  get abilityList() {
    return this._abilityList;
  }
  set abilityList(value) {
    this._abilityList = value;
  }

  toJson() {
    return {
      abilityList: this._abilityList,
    };
  }
}
