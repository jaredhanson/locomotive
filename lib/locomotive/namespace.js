/**
 * Module dependencies.
 */
var inflect = require('./inflect');


/**
 * `Namespace` constructor.
 *
 * @api private
 */
function Namespace(path, options, parent) {
  options = options || {};
  options.module = (options.module !== undefined) ? options.module : path;
  
  this.path = path || '';
  this.module = inflect.camelize(options.module || '', true);
  this.parent = parent || null;
};

/**
 * Fully qualified path.
 *
 * @param {String} controller
 * @return {String}
 * @api protected
 */
Namespace.prototype.qpath = function(path) {
  var qual = path;
  var ns = this;
  while (ns) {
    qual = (ns.path.length) ? ((qual[0] === '/') ? (ns.path + qual) : (ns.path + '/' + qual)) : (qual);
    ns = ns.parent;
  }
  qual = (qual[0] === '/') ? (qual) : ('/' + qual);
  return qual;
}

/**
 * Fully qualified module.
 *
 * @param {String} controller
 * @return {String}
 * @api protected
 */
Namespace.prototype.qmodule = function(controller) {
  var qual = controller;
  var ns = this;
  while (ns) {
    qual = (ns.module.length) ? (ns.module + '::' + qual) : (qual);
    ns = ns.parent;
  }
  return qual;
}


/**
 * Expose `Namespace`.
 */
module.exports = Namespace;
