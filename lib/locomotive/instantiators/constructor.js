module.exports = function() {

  return function(mod) {
    if (typeof mod != 'function') { return; }
    var name = mod.name || 'anonymous';
    if (name[0] != name[0].toUpperCase()) { return; }
    return new mod;
  }
}
