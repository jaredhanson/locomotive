function MockRequest() {
  this.method = 'GET';
  this.url = '/';
  this.headers = {};
  this.params = {};
}

MockRequest.prototype.param = function(name, defaultValue) {
  return this.params[name] || defaultValue;
}


module.exports = MockRequest;
