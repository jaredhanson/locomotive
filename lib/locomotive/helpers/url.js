/**
 * Module dependencies.
 */
var tag = require('./tag').tag
  , escape = require('../utils').escape;


/**
 * Construct a link tag.
 *
 * Examples:
 *
 *   linkTo('/users/1', 'You', { rel: 'me' });
 *   // => "<a rel="me" href="/users/1">You</a>"
 *
 *   linkTo({ controller: 'profile', action: 'show' }, 'Profile');
 *   // => "<a href="http://www.example.com/profile">Profile</a>"
 *
 *   linkTo(animal, 'An Animal');
 *   // => "<a href="http://www.example.com/animals/123">An Animal</a>"
 *
 * @param {String|Object} url
 * @param {String} text
 * @param {Object} options
 * @return {String}
 * @api public
 */
function linkTo(url, text, options) {
  if (typeof text === 'object') {
    options = text;
    text = null;
  }
  if (typeof url !== 'string') {
    url = this.urlFor(url);
  }
  options = options || {};
  options.href = encodeURI(url);
  
  return tag('a', options, function() {
    return escape(text || url);
  });
}

/**
 * Construct a mailto: link tag.
 *
 * Examples:
 *
 *   mailTo('johndoe@example.com');
 *   // => "<a href="mailto:johndoe@example.com">johndoe@example.com</a>"
 *
 *   mailTo('johndoe@example.com', 'John Doe');
 *   // => "<a href="mailto:johndoe@example.com">John Doe</a>"
 *
 *   mailTo('johndoe@example.com', 'John Doe', { class: 'email' });
 *   // => "<a class="email" href="mailto:johndoe@example.com">John Doe</a>"
 *
 * @param {String} email
 * @param {String} text
 * @param {Object} options
 * @return {String}
 * @api public
 */
function mailTo(email, text, options) {
  if (typeof text === 'object') {
    options = text;
    text = null;
  }
  options = options || {};
  options.href = encodeURI('mailto:' + email);
  
  return tag('a', options, function() {
    return escape(text || email);
  });
}


/**
 * Export helpers.
 */
exports.linkTo = linkTo;
exports.mailTo = mailTo;
