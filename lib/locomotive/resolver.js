function Resolver() {
  this._mechs = [];
}

Resolver.prototype.resolve = function(id) {
  var mechs = this._mechs
    , mech, prefix, mid, rid;
  for (var i = 0, len = mechs.length; i < len; ++i) {
    mech = mechs[i];
    prefix = mech.prefix;
    if (id.indexOf(prefix) !== 0) { continue; }
    mid = id.slice(prefix.length);
    rid = mech.fn(mid);
    if (rid) { return rid; }
  }
  throw new Error("Unable to resolve '" + id + "'");
}

Resolver.prototype.use = function(prefix, fn) {
  if (typeof prefix == 'function') {
    fn = prefix;
    prefix = '';
  }
  if (prefix.length && prefix[prefix.length - 1] != '/') { prefix += '/'; }
  this._mechs.push({ prefix: prefix, fn: fn });
}

module.exports = Resolver;
