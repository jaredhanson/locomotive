var vows = require('vows');
var assert = require('assert');
var util = require('util');
var helpers = require('locomotive/helpers');


vows.describe('helpers').addBatch({
  
  'url helpers': {
    'should be exported': function () {
      assert.isFunction(helpers.linkTo);
    },
  },
  
}).export(module);
