function urlFor(req, res) {
  
  return function(options) {
    var protocol = options.protocol || 'http';
    return protocol + '://';
  }
}


exports.urlFor = urlFor;
