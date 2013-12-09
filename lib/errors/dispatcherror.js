/**
 * `DispatchError` error.
 *
 * @api private
 */
function DispatchError(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DispatchError';
  this.message = message;
}

/**
 * Inherit from `DispatchError`.
 */
DispatchError.prototype.__proto__ = Error.prototype;


/**
 * Expose `DispatchError`.
 */
module.exports = DispatchError;
