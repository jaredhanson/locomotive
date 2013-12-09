/**
 * Module dependencies.
 */
var underscore = require('../../utils').underscore;


/**
 * Resolve an id or path to a snake_case path.
 *
 * This is the default resolution algorithm used to locate views within
 * Locomotive applications.
 */
module.exports = function() {
  
  return function(id) {
    return underscore(id);
  };
};
