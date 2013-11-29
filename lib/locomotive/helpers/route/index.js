module.exports = function(controller, action, placeholders, onlyPath) {

  return function(obj) {
    if (arguments.length !== placeholders.length) { throw new Error('Incorrect number of arguments for route helper to ' + controller + '#' + action); }
    
    var options = { controller: controller, action: action, onlyPath: onlyPath };    
    for (var i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      var placeholder = placeholders[i];
    
      if (arg && arg.id) {
        options[placeholder] = arg.id;
      } else if (arg) {
        options[placeholder] = arg;
      }
    }
    return this.urlFor(options);
  }
}
