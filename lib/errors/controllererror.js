/**
 * `ControllerError` error.
 *
 * @api private
 */
function ControllerError(message) {
  Error.call(this);
  Error.captureStackTrace(this, ControllerError);
  this.name = 'ControllerError';
  this.message = message;
}

/**
 * Inherit from `Error`.
 *
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Example.3A_Custom_Error_Types
 */
ControllerError.prototype = Object.create(Error.prototype);
ControllerError.prototype.constructor = ControllerError;

/**
 * Expose `ControllerError`.
 */
module.exports = ControllerError;
