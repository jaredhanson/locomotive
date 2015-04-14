/**
 * `DispatchError` error.
 *
 * @api private
 */
function DispatchError(message) {
  Error.call(this);
  Error.captureStackTrace(this, DispatchError);
  this.name = 'DispatchError';
  this.message = message;
}

/**
 * Inherit from `DispatchError`.
 *
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Example.3A_Custom_Error_Types
 */
DispatchError.prototype = Object.create(Error.prototype);
DispatchError.prototype.constructor = DispatchError;

/**
 * Expose `DispatchError`.
 */
module.exports = DispatchError;
