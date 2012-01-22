/**
 * `Namespace` constructor.
 *
 * @api private
 */
function Namespace(name, options, parent) {
  options = options || {};
  
  this.name = name || '';
  this.module = options.module || this.name;
  this.parent = parent || null;
};


/**
 * Expose `Namespace`.
 */
module.exports = Namespace;
