/**
 * Module dependencies.
 */
var Application = require('./application')
  , Controller = require('./controller');


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Application();

/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Locomotive =
exports.Application = Application;
exports.Controller = Controller;

/**
 * Expose CLI.
 *
 * @api private
 */
exports.cli = require('./cli');
