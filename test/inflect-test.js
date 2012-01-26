var vows = require('vows');
var assert = require('assert');
var inflect = require('locomotive/inflect');
var util = require('util');


vows.describe('Module').addBatch({
  
  'inflect': {
    'should export lingo functions': function () {
      assert.isFunction(inflect.capitalize);
      assert.isFunction(inflect.join);
      assert.isFunction(inflect.en.pluralize);
      assert.isFunction(inflect.en.singularize);
    },
  },
  
  'camelize': {
    'should lowercase first character': function () {
      assert.equal(inflect.camelize('foo_bar'), 'fooBar');
    },
    'should uppercase first character if set': function () {
      assert.equal(inflect.camelize('foo_bar_baz', true), 'FooBarBaz');
    },
  },
  
  'underscore': {
    'should underscore camelcase words': function () {
      assert.equal(inflect.underscore('FooBar'), 'foo_bar');
    },
    'should underscore camelcase words with consequtive capital letters': function () {
      assert.equal(inflect.underscore('SSLError'), 'ssl_error');
    },
  },
  
}).export(module);
