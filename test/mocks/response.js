function MockResponse(cb) {
  this.statusCode = 200;
  this.locals = {};
  this._headers = {};
  this._data = '';
  this._cb = cb;
}

MockResponse.prototype.getHeader = function(name) {
  return this._headers[name];
};

MockResponse.prototype.setHeader = function(name, value) {
  this._headers[name] = value;
};

MockResponse.prototype.render = function(view, options, fn) {
  this._view = view;
  this._options = options;
  if (fn) { return fn(); }
  this.end();
}

MockResponse.prototype.end = function(data, encoding) {
  if (data) { this._data += data; }
  if (this._data.length) { this.body = this._data; }
  if (this._cb) { this._cb(); }
};


module.exports = MockResponse;
