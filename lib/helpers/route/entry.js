/**
 * Create route helper for `controller` and `action` with required
 * `placeholders`.
 *
 * @param {String} controller
 * @param {String} action
 * @param {Array} placeholders
 * @param {Boolean} onlyPath
 * @return {Function}
 * @api private
 */
module.exports = function(controller, action, placeholders, onlyPath) {

  return function(obj) {
    if (arguments.length !== placeholders.length) { throw new Error('Incorrect number of arguments passed to route helper for ' + controller + '#' + action); }
    
    var options = { controller: controller, action: action, onlyPath: onlyPath };
    for (var i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      var placeholder = placeholders[i];
    
      if (arg && (arg.id || arg.id === 0)) {
        options[placeholder] = arg.id;
      } else if (arg || arg === 0) {
        options[placeholder] = arg;
      }
    }
    return this.urlFor(options);
  };
};
