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
  options.href = 'mailto:' + email;
  
  return tag('a', options, function() {
    return text || email;
  });
}


/**
 * Export helpers.
 */
exports.linkTo = linkTo;
exports.mailTo = mailTo;
