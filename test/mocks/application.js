var snakeCase = snakeCase = require('../../lib/resolvers/any/snakecase')();


function MockApplication() {
  this._controllers = {};
  this._formats = {};
  
  this.views = { resolve: snakeCase };
}

MockApplication.prototype.format = function(fmt, options) {
  this._formats[fmt] = options;
};

MockApplication.prototype._controller = function(id, cb) {
  var ctrl = this._controllers[id];
  if (!ctrl) {
    return cb(new Error('Unable to create controller "' + id + '"'));
  }
  return cb(null, ctrl);
};


module.exports = MockApplication;
