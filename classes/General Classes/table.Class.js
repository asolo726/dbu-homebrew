class Table {
  constructor(headers, rows) {
    this._headers = headers;
    this._rows = rows;
  }

  get headers() {
    return this._headers;
  }
  
  set headers(value) {
    this._headers = value;
  }

  get rows() {
    return this._rows;
  }

  set rows(value) {
    this._rows = value;
  }
}

export default Table;