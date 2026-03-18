class Factor {
  constructor({ raceReq, maxFactor = 1, preReq } = {}) {
    this._raceReq = raceReq;
    this._maxFactor = maxFactor;
    this._preReq = preReq;
  }

  get raceReq() {
    return this._raceReq;
  }

  get maxFactor() {
    return this._maxFactor;
  }

  get preReq() {
    return this._preReq;
  }

  set raceReq(value) {
    this._raceReq = value;
  }

  set maxFactor(value) {
    this._maxFactor = value;
  }

  set preReq(value) {
    this._preReq = value;
  }
}

export default Factor;
