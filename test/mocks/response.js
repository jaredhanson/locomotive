var events = require('events')
  , util = require('util');


function MockResponse(cb) {
  events.EventEmitter.call(this);
  
  this.statusCode = 200;
  this.locals = {};
  this._headers = {};
  this._data = '';
  this._cb = cb;
}

util.inherits(MockResponse, events.EventEmitter);

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

MockResponse.prototype.redirect = function(url, status) {
  this.statusCode = status || 302;
  this.setHeader('Location', url);
  this.end();
};


MockResponse.prototype.end = function(data, encoding) {
  if (data) { this._data += data; }
  if (this._data.length) { this.body = this._data; }
  if (this._cb) { this._cb(); }
  this.emit('finish');
};


module.exports = MockResponse;
