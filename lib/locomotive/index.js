/**
 * Module dependencies.
 */
var Application = require('./application')
  , Controller = require('./controller');


/**
 * Expose default singleton.
 *
 * @api public
 */
exports = module.exports = new Application();

/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Export constructors.
 */
exports.Locomotive =
exports.Application = Application;
exports.Controller = Controller;

/**
 * Export CLI.
 *
 * @api private
 */
exports.cli = require('./cli');
