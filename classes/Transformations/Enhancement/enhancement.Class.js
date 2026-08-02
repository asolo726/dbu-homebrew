class Enhancement {
  constructor(head, traits = [], burstLimit) {
    this._head = head;
    this._traits = traits;
    this._burstLimit = burstLimit;
  }

  get head() {
    return this._head;
  }
  set head(value) {
    this._head = value;
  }
  get traits() {
    return this._traits;
  }
  set traits(value) {
    this._traits = value;
  }
  get burstLimit() {
    return this._burstLimit;
  }
  set burstLimit(value) {
    this._burstLimit = value;
  }
}

export default Enhancement;
