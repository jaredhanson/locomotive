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
 * Export boot phases.
 */
exports.boot.controllers = require('./boot/controllers');
exports.boot.views = require('./boot/views');
exports.boot.routes = require('./boot/routes');
exports.boot.httpServer = require('./boot/httpserver');
exports.boot.httpServerCluster = require('./boot/httpservercluster');

/**
 * Export CLI.
 *
 * @api private
 */
exports.cli = require('./cli');
