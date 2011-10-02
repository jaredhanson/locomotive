/**
 * `RouterError` error.
 *
 * @api private
 */
function RouterError(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'RouterError';
  this.message = message;
};

/**
 * Inherit from `RouterError`.
 */
RouterError.prototype.__proto__ = Error.prototype;


/**
 * Expose `RouterError`.
 */
module.exports = RouterError;
