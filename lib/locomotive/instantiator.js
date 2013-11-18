function Instantiator() {
  this._mechs = [];
}

Instantiator.prototype.instantiate = function(mod, id, cb) {
  var self = this
    , mechs = this._mechs
    , idx = 0;
  
  function next(err, inst) {
    if (err || inst) { return cb(err, inst); }
    var mech = mechs[idx++];
    if (!mech) { return cb(new Error("Unable to instantiate '" + id + "'")); }
    try {
      var arity = mech.length;
      if (arity == 2) {
        mech(mod, next);
      } else {
        var inst = mech(mod);
        next(null, inst);
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
}

Instantiator.prototype.use = function(fn) {
  this._mechs.push(fn);
}

module.exports = Instantiator;
