class Awakening {
  constructor(head, traits = [], grandAwakening) {
    this._head = head;
    this._traits = traits;
    this._grandAwakening = grandAwakening; // Only for Super Awakenings
  }

  get traits() {
    return this._traits;
  }

  set traits(value) {
    this._traits = value;
  }

  get head() {
    return this._head;
  }

  set head(value) {
    this._head = value;
  }

  get grandAwakening() {
    return this._grandAwakening;
  }

  set grandAwakening(value) {
    this._grandAwakening = value;
  }
}

export default Awakening;
