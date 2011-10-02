var vows = require('vows');
var assert = require('assert');
var locomotive = require('locomotive');
var util = require('util');


vows.describe('Module').addBatch({
  
  'locomotive': {
    'should report a version': function (x) {
      assert.isString(locomotive.version);
    },
  },
  
}).export(module);
