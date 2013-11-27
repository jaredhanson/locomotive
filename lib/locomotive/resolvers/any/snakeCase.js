var underscore = require('../../utils').underscore;

module.exports = function(options) {
  
  return function(id) {
    return underscore(id);
  }
}
