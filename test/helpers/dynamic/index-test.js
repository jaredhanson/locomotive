var vows = require('vows');
var assert = require('assert');
var util = require('util');
var dynamicHelpers = require('locomotive/helpers/dynamic');


vows.describe('dynamicHelpers').addBatch({
  
  'url helpers': {
    'should be exported': function () {
      assert.isFunction(dynamicHelpers.urlFor);
    },
  },
  
}).export(module);
