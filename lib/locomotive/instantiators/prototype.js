/**
 * Instantiate object from prototype exported by module.
 *
 * This instantiation mechanism is used to create new objects from prototype
 * objects exported by a module.
 *
 * In the case of Locomotive controllers, this allows request-specific
 * properties to be assigned to each instance, without causing conflicts due to
 * concurrency.
 *
 * @return {Function}
 * @api private
 */
module.exports = function() {

  return function(mod) {
    if (typeof mod != 'object') { return; }
    return Object.create(mod);
  }
}
