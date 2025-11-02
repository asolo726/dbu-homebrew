class Head {
    constructor(title, banner = "", desc = "" ){
        this._title = title;
        this._banner = banner;
        this._desc = desc;
    }


    
    get title(){ return this._title; }
    set title(value){ this._title = value; }
    get banner(){ return this._banner; }
    set banner(value){ this._banner = value; }
    get desc(){ return this._desc; }
    set desc(value){ this._desc = value; }
}

export default Head;