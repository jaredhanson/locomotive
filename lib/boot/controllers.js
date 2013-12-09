/**
 * Controllers initialization phase.
 *
 * This phase configures a Locomotive application with the required mechanisms
 * to resolve and instantiate controllers.
 *
 * It is recommended that this phase be the first phase in the boot sequence.
 * Earlier phases in the sequence can register alternative mechanisms, in order
 * to override this resolution and instantiation process.  This is considered
 * advanced usage, however, and is generally not recommended.
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
  if ('string' == typeof options) {
    options = { dirname: options };
  }
  options = options || {};
  var dirname = options.dirname || 'app/controllers';
  
  return function controllers() {
    // Register controller resolution and instantiation mechanisms.  These
    // mechanisms allow Locomotive to automatically `require` controllers and
    // instantiate instances from the exported value.
    this.controllers.resolve.use(require('../resolvers/node/controller')(dirname));
    this.controllers.instantiate.use(require('../instantiators/prototype')());
    this.controllers.instantiate.use(require('../instantiators/constructor')());
  };
};
