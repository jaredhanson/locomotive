/**
 * Instantiate object from prototype exported by module.
 *
 * This instantiation mechanism is used to create new objects from prototype
 * objects exported by a module.
 *
 * In the case of Maglev controllers, this allows request-specific
 * properties to be assigned to each instance, without causing conflicts due to
 * concurrency.
 *
 * Example Maglev controller written in prototype style:
 *
 *     var Controller = require('maglev').Controller;
 *
 *
 *     var sessionController = new Controller();
 *
 *     sessionController.before('new', ensureLoggedOut());
 *
 *     sessionController.new = function() {
 *       this.render('login');
 *     };
 *
 *     module.exports = sessionController;
 *
 * @return {Function}
 * @api private
 */
module.exports = function() {

  return function(mod) {
    if (typeof mod != 'object') { return; }
    return Object.create(mod);
  };
};
