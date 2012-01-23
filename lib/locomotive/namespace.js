/**
 * Module dependencies.
 */
var inflect = require('./inflect');


/**
 * `Namespace` constructor.
 *
 * @api private
 */
function Namespace(name, options, parent) {
  options = options || {};
  
  this.name = name || '';
  this.module = inflect.camelize(options.module || this.name, true);
  this.parent = parent || null;
};

/**
 * Fully qualified controller.
 *
 * @param {String} controller
 * @return {String}
 * @api protected
 */
Namespace.prototype.qcontroller = function(controller) {
  var qual = controller;
  var ns = this;
  while (ns) {
    qual = (ns.module.length) ? (ns.module + '::' + qual) : (qual);
    ns = ns.parent;
  }
  return qual;
}

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
    qual = (ns.name.length) ? ((qual[0] === '/') ? (ns.name + qual) : (ns.name + '/' + qual)) : (qual);
    ns = ns.parent;
  }
  qual = (qual[0] === '/') ? (qual) : ('/' + qual);
  return qual;
}


/**
 * Expose `Namespace`.
 */
module.exports = Namespace;
