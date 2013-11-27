/**
 * Fallback initialization phase.
 *
 * This phase is executed after environments and initializers, and allows
 * Locomotive to register fallback settings, which will be used if no
 * application-specific settings were otherwise specified.
 *
 * @param {Object} options
 * @param {Application} self
 * @return {Function}
 * @api private
 */
module.exports = function(options, self) {
  options = options || {};
  
  return function fallbacks(done) {
    // Register controller resolution and instantiation mechanisms.  These
    // mechanisms allow Locomotive to automatically `require` controllers and
    // instantiate instances from the exported value.
    self.controllers.resolve.use(require('../resolvers/node/controller')(options.controllersDir));
    self.controllers.instantiate.use(require('../instantiators/prototype')());
    self.controllers.instantiate.use(require('../instantiators/constructor')());
    
    // Register view resolution mechanisms.
    self.views.resolve.use(require('../resolvers/any/snakeCase')());
    
    // Register the default, object-based datastore.  This is done during the
    // fallback phase, after initializers have been invoked, to make this
    // datastore the lowest priority.  Any datastores registered by the
    // application during initialization will take priority.
    self.datastore(require('../datastores/object'));
    
    done();
  }
}
