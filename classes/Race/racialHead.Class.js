/**
 * This class is used for pages revolving around racial pages:
 * - Races
 * - Factors
 */
class racialHead {
    constructor({
        title,
        banner,
        desc,
        author,
        bannerAuthor,
    } = {}) {
        this._title = title;
        this._banner = banner;
        this._desc = desc;
        this._author = author;
        this._bannerAuthor = bannerAuthor;
    }

    get title() {
        return this._title;
    }

    get banner() {
        return this._banner;
    }

    get desc() {
        return this._desc;
    }

    get author() {
        return this._author;
    }

    get bannerAuthor() {
        return this._bannerAuthor;
    }

    set title(value) {
        this._title = value;
    }

    set banner(value) {
        this._banner = value;
    }

    set desc(value) {
        this._desc = value;
    }

    set author(value) {
        this._author = value;
    }

    set bannerAuthor(value) {
        this._bannerAuthor = value;
    }
}

export default racialHead;