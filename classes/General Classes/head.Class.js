class Head {
  constructor(
    title = "",
    banner = "",
    desc = "",
    bannerAuthor = "",
    identity = "",
  ) {
    this._title = title;
    this._banner = banner;
    this._desc = desc;
    this._bannerAuthor = bannerAuthor;
    this._identity = identity;
    this._keyName = title.replaceAll(" ", "-");
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
