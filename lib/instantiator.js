/**
 * Creates an instance of `Instantiator`.
 *
 * An instantiator is responsible for instantiating objects.
 *
 * Locomotive uses an instatiator to instantiate controllers, typically from
 * a constructor or prototype exported by a module.
 *
 * @constructor
 * @api protected
 */
function Instantiator() {
  this._mechs = [];
}

/**
 * Instantiate `mod` identified by `id`.
 *
 * @param {Object} mod
 * @param {String} id
 * @param {Function} cb
 * @api protected
 */
Instantiator.prototype.instantiate = function(mod, id, cb) {
  var mechs = this._mechs
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
        var ins = mech(mod);
        next(null, ins);
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
};

/**
 * Utilize new mechanism `fn`.
 *
 * @param {Function} fn
 * @api protected
 */
Instantiator.prototype.use = function(fn) {
  this._mechs.push(fn);
};


/**
 * Expose `Instantiator`.
 */
module.exports = Instantiator;
