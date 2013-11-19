function MockApplication() {
  this._formats = {};
}

MockApplication.prototype.format = function(fmt, options) {
  this._formats[fmt] = options;
}


module.exports = MockApplication;
