/**
 * Module dependencies.
 */
var tag = require('./tag').tag;


/**
 * Construct a link tag.
 *
 * Examples:
 *
 *   linkTo('You', '/users/1', { rel: 'me' });
 *   // => "<a rel="me" href="/users/1">You</a>"
 *
 *   linkTo('Profile', { controller: 'ProfileController', action: 'show' });
 *   // => "<a href="http://www.example.com/profile">Profile</a>"
 *
 *   linkTo('An Animal', animal);
 *   // => "<a href="http://www.example.com/animals/123">An Animal</a>"
 *
 * @param {String} text
 * @param {String|Object} url
 * @param {Object} options
 * @return {String}
 * @api public
 */
function linkTo(text, url, options) {
  options = options || {};
  if (typeof url === 'string') {
    options.href = url;
  } else {
    options.href = this.urlFor(url);
  }
  
  return tag('a', options, function() {
    return text;
  });
}


exports.linkTo = linkTo;
