/**
 * Instantiate object from constructor exported by module.
 *
 * This instantiation mechanism is used to create new objects from constructor
 * functions exported by a module.
 *
 * In the case of Maglev controllers, request-specific properties will be
 * assigned to each new instance, in order to avoid causing conflicts due to
 * concurrency.
 *
 * Example Maglev controller written in constructor style:
 *
 *     var Controller = require('maglev').Controller
 *       , inherits = require('util').inherits;
 *
 *
 *     function ProfileController() {
 *       Controller.call(this);
 *
 *       this.before('show', ensureLoggedIn());
 *     }
 *     inherits(ProfileController, Controller);
 *
 *     ProfileController.prototype.show = function() {
 *       this.user = this.req.user;
 *       this.render();
 *     };
 *
 *     module.exports = ProfileController;
 *
 * @return {Function}
 * @api private
 */
module.exports = function() {

  return function(Mod) {
    if (typeof Mod != 'function') { return; }
    var name = Mod.name || 'anonymous';
    if (name[0] != name[0].toUpperCase()) { return; }
    return new Mod();
  };
};
