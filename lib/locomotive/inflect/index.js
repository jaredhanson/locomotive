/**
 * Module dependencies.
 */
var lingo = require('lingo');

/**
 * Re-export Lingo module.
 */
exports = module.exports = lingo;


/**
 * Camel-ize the given `str`.
 *
 * Examples:
 *
 *    inflect.camelize('foo_bar');
 *    // => "fooBar"
 *  
 *    inflect.camelcase('foo_bar_baz', true);
 *    // => "FooBarBaz"
 *
 * @param {String} str
 * @param {Boolean} uppercaseFirst
 * @return {String}
 * @api public
 */
exports.camelize = function(str, uppercaseFirst){
  return str.split('_').map(function(word, i){
    if (i || (0 == i && uppercaseFirst)) {
      word = exports.capitalize(word);
    }
    return word;
  }).join('');
};
