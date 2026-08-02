import AwakeningHead from "./awakeningHead.Class";
class Awakening {
  constructor(head = new AwakeningHead(), traits = [], grandAwakening) {
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

  toJson(){
    const headJson = this._head.toJson();
    const grandAwakeningJson = this._grandAwakening.toJson();
    return{
      head: headJson,
      traits: this._traits.map(trait => trait.toJson()),
      grandAwakening: grandAwakeningJson,
    }
  }
}

export default Awakening;
