function MockApplication() {
  this._controllers = {};
  this._formats = {};
}

MockApplication.prototype.format = function(fmt, options) {
  this._formats[fmt] = options;
}

MockApplication.prototype._controller = function(id, cb) {
  var ctrl = this._controllers[id];
  if (!ctrl) {
    return cb(new Error("Unable to create controller '" + id + "'"));
  }
  return cb(null, ctrl);
}


module.exports = MockApplication;
