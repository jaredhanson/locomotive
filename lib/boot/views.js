/**
 * Views initialization phase.
 *
 * This phase configures a Locomotive application with the required mechanisms
 * to resolve views.
 *
 * It is recommended that this phase be the second phase in the boot sequence.
 * Earlier phases in the sequence can register alternative mechanisms, in order
 * to override this resolution process.  This is considered advanced usage,
 * however, and is generally not recommended.
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
  options = options || {};
  
  return function views() {
    // Register view resolution mechanisms.
    this.views.resolve.use(require('../resolvers/any/snakecase')());
  };
};
