/**
 * Module dependencies.
 */
var utils = require('./utils');


/**
 * `Namespace` constructor.
 *
 * @api private
 */
function Namespace(path, options, parent) {
  options = options || {};
  options.module = (options.module !== undefined) ? options.module : path;
  options.helper = (options.helper !== undefined) ? options.helper : path;
  
  this.path = path || '';
  this.module = utils.moduleize(options.module) || '';
  this.helper = utils.helperize(options.helper) || '';
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
  qual = (qual.length > 1 && qual[qual.length - 1] === '/') ? (qual.slice(0, qual.length - 1)) : (qual);
  return qual;
}

/**
 * Fully qualified controller.
 *
 * Contructs a fully qualified name for `controller`, including any module
 * segments corresponding to namespaces.  For instance, `PostsControlller`
 * within an "admin" namespace would have a fully qualified name of
 * `Admin::PostsController`.
 *
 * @param {String} controller
 * @return {String}
 * @api protected
 */
Namespace.prototype.qcontroller = function(controller) {
  var qual = utils.controllerize(controller);
  var ns = this;
  while (ns) {
    qual = (ns.module.length) ? (ns.module + '::' + qual) : (qual);
    ns = ns.parent;
  }
  return qual;
}

/**
 * Fully qualified helper.
 *
 * Contructs a fully qualified helper function name, including any components
 * corresponding to namespaces or nested resources.  For instance, an "albums"
 * resource nested under a "bands" resource would yeild helpers in the form of
 * `bandAlbumsPath`, `newBandAlbumPath`, etc.
 *
 * @param {String} controller
 * @return {String}
 * @api protected
 */
Namespace.prototype.qhelper = function(helper) {
  var comps = [helper];
  var ns = this;
  while (ns) {
    if (ns.helper.length) { comps.unshift(ns.helper); }
    ns = ns.parent;
  }
  
  return utils.helperize.apply(undefined, comps);
}


/**
 * Expose `Namespace`.
 */
module.exports = Namespace;
