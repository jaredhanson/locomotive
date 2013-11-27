var vows = require('vows');
var assert = require('assert');
var utils = require('locomotive/utils')


vows.describe('util').addBatch({
  
  'underscore': {
    'should underscore camelcase words': function () {
      assert.equal(utils.underscore('FooBar'), 'foo_bar');
    },
    'should underscore camelcase words with consequtive capital letters': function () {
      assert.equal(utils.underscore('SSLError'), 'ssl_error');
    },
    'should underscore dasherized words': function () {
      assert.equal(utils.underscore('foo-bar'), 'foo_bar');
    },
  }
  
}).export(module);
