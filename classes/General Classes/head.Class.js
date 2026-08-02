class Head {
  constructor(
    title = "",
    banner = "",
    desc = "",
    author = "",
    authorID = "",
    bannerAuthor = "",
    identity = "",
  ) {
    this._title = title;
    this._banner = banner;
    this._desc = desc;
    this._author = author;
    this._authorID = authorID;
    this._bannerAuthor = bannerAuthor;
    this._identity = identity;
    this._keyName = title.replaceAll(" ", "-").toLowerCase();
  }

  get title() {
    return this._title;
  }
  set title(value) {
    this._title = value;
  }
  get banner() {
    return this._banner;
  }
  set banner(value) {
    this._banner = value;
  }
  get desc() {
    return this._desc;
  }
  set desc(value) {
    this._desc = value;
  }
  get author() {
    return this._author;
  }
  set author(value) {
    this._author = value;
  }
  get authorID() {
    return this._authorID;
  }
  set authorID(value) {
    this._authorID = value;
  }
  get bannerAuthor() {
    return this._bannerAuthor;
  }
  set bannerAuthor(value) {
    this._bannerAuthor = value;
  }

  get identity() {
    return this._identity;
  }
  set identity(value) {
    this._identity = value;
  }
}

export default Head;
