/**
 * Construct an HTML tag.
 *
 * Examples:
 *
 *    tag('br');
 *    // => "<br>"
 *
 *    tag('br', true);
 *    // => "<br/>"
 *
 *    tag('img', { src: '/image.png', width: 100, height: 60 });
 *    // => "<img src="/image.png" width="100" height="60">"
 *
 *    tag('img', { src: '/image.png', width: 100, height: 60 }, true);
 *    // => "<img src="/image.png" width="100" height="60"/>"
 *
 *    tag('p', function() { return 'hello' });
 *    // => "<p>hello</p>"
 *
 *    tag('p', { id: 'intro' }, function() { return 'hello' });
 *    // => "<p id="intro">hello</p>"
 *
 * @param {String} name
 * @param {Object} options
 * @param {Boolean|Function} close or callback
 * @return {String}
 * @api public
 */
function tag(name, options, close, cb) {
  if (typeof close === 'function') {
    cb = close;
    close = true;
  }
  if (typeof options === 'function') {
    cb = options;
    close = true;
    options = {};
  } else if (typeof options === 'boolean') {
    close = options;
    options = {};
  }
  
  var end = close ? '/>' : '>';
  var out = '<' + name;
  for (var attr in options) {
    out += ' ' + attr + '="' + options[attr] + '"';
  }
  if (cb && close) {
    var content = cb();
    if (content && content.length) {
      out += '>';
      out += content;
      end = '</' + name + '>';
    }
  }
  out += end;
  return out;
}

/**
 * Open an HTML tag.
 *
 * Examples:
 *
 *    openTag('br');
 *    // => "<br>"
 *
 *    openTag('img', { src: '/image.png', width: 100, height: 60 });
 *    // => "<img src="/image.png" width="100" height="60">"
 *
 * @param {String} name
 * @param {Object} options
 * @return {String}
 * @api public
 */
function openTag(name, options) {
  return tag(name, options);
}

/**
 * Close an HTML tag.
 *
 * Examples:
 *
 *    closeTag('p');
 *    // => "</p>"
 *
 * @param {String} name
 * @return {String}
 * @api public
 */
function closeTag(name) {
  return '</' + name + '>';
}


/**
 * Export helpers.
 */
exports.tag = tag;
exports.openTag = openTag;
exports.closeTag = closeTag;
