/**
 * Datastores initialization phase.
 *
 * This phase configures a Locomotive application with fallbacks for datastore
 * introspection.
 *
 * It should be noted that these adapters simply introspect records loaded from
 * a model layer, providing model awareness to routing helpers.  They do not
 * actually persist data, as Locomotive itself provides no ORM, but rather
 * allows developers to choose the most appropriate solution for their
 * application.
 *
 * It is recommended that this phase be ordered after initializers, allowing
 * applications to register higher-priority introspection mechanisms, as the
 * fallback is of only marginal utility.
 *
 * @return {Function}
 * @api protected
 */
module.exports = function() {
  
  return function datastores() {
    // Register the default, object-based datastore.  This is done during the
    // fallback phase, after initializers have been invoked, to make this
    // datastore the lowest priority.  Any datastores registered by the
    // application during initialization will take priority.
    this.datastore(require('../datastores/object'));
  };
};
