/**
 * `ControllerError` error.
 *
 * @api private
 */
function ControllerError(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'ControllerError';
  this.message = message;
};

/**
 * Inherit from `Error`.
 */
ControllerError.prototype.__proto__ = Error.prototype;


/**
 * Expose `ControllerError`.
 */
module.exports = ControllerError;
