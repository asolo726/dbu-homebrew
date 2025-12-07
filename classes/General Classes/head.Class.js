class Head {
    constructor(title, banner = "", desc = "", bannerAuthor = ""){
        this._title = title;
        this._banner = banner;
        this._desc = desc;
        this._bannerAuthor = bannerAuthor;
    }


    
    get title(){ return this._title; }
    set title(value){ this._title = value; }
    get banner(){ return this._banner; }
    set banner(value){ this._banner = value; }
    get desc(){ return this._desc; }
    set desc(value){ this._desc = value; }
    get bannerAuthor(){ return this._bannerAuthor; }
    set bannerAuthor(value){ this._bannerAuthor = value; }
}

export default Head;