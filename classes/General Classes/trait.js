class Trait {
    constructor(traitIntro, abilities =[{}]) {
        this._traitIntro = traitIntro;
        this._abilities = abilities;
    }

    get traitIntro(){ return this._traitIntro; }
    get abilities(){ return this._abilities; }
}