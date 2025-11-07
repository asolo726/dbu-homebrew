class Manifested {
    constructor(head, traits = []) {
        this._head = head;
        this._traits = traits;
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
}

export default Manifested;
