/**
 * Fallback initialization phase.
 *
 * This phase is executed after environments and initializers, and allows
 * Locomotive to register fallback settings, which will be used if no
 * application-specific settings were otherwise specified.
 *
 * @param {Locomotive} self
 * @return {Function}
 * @api private
 */
module.exports = function(options, self) {
  options = options || {};
  
  return function fallbacks(done) {
    // Register module resolution and instantiation mechanisms.  These
    // mechanisms allow Locomotive to automatically `require` modules and
    // instantiate instances from the exported value.
    self.resolve.controller.use(require('../resolvers/controller/node')(options.controllersDir));
    
    // Register the default, object-based datastore.  This is done during the
    // fallback phase, after initializers have been invoked, to make this
    // datastore the lowest priority.  Any datastores registered by the
    // application during initialization will take priority.
    self.datastore(require('../datastores/object'));
    done();
  }
}
