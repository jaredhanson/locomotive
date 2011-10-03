var vows = require('vows');
var assert = require('assert');
var inflect = require('locomotive/inflect');
var util = require('util');


vows.describe('Module').addBatch({
  
  'inflect': {
    'should export lingo functions': function () {
      assert.isFunction(inflect.capitalize);
      assert.isFunction(inflect.camelcase);
      assert.isFunction(inflect.join);
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
  
  'controllerize': {
    'should append Controller to string': function () {
      assert.equal(inflect.controllerize('Foo'), 'FooController');
    },
    'should not append Controller to string if it exists': function () {
      assert.equal(inflect.controllerize('FooController'), 'FooController');
    },
  },
  
  'decontrollerize': {
    'should remove Controller from string': function () {
      assert.equal(inflect.decontrollerize('FooController'), 'Foo');
    },
    'should not remove Controller from string if it does not exists': function () {
      assert.equal(inflect.decontrollerize('Foo'), 'Foo');
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
