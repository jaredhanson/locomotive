var vows = require('vows');
var assert = require('assert');
var utils = require('locomotive/utils')


vows.describe('util').addBatch({
  
  'capitalize': {
    'should be reexported from lingo': function () {
      assert.isFunction(utils.capitalize);
    },
  },
  
  'decapitalize': {
    'should lowercase an uppercase first character': function () {
      assert.equal(utils.decapitalize('Hello there'), 'hello there');
    },
  },
  
  'camelize': {
    'should lowercase first character': function () {
      assert.equal(utils.camelize('foo_bar'), 'fooBar');
    },
    'should uppercase first character if set': function () {
      assert.equal(utils.camelize('foo_bar_baz', true), 'FooBarBaz');
    },
    'should camelize dasherized words with lowercase first character': function () {
      assert.equal(utils.camelize('foo-bar'), 'fooBar');
    },
    'should camelize dasherized words with uppercase first character': function () {
      assert.equal(utils.camelize('foo-bar-baz', true), 'FooBarBaz');
    },
  },
  
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
  },
  
  'pathize': {
    'should denormalize to underscore notation': function () {
      assert.equal(utils.pathize('FooController'), 'foo');
      assert.equal(utils.pathize('FooBarBazController'), 'foo_bar_baz');
      assert.equal(utils.pathize('Fulano::FooController'), 'fulano/foo');
      assert.equal(utils.pathize('FulanoSutano::FooBarController'), 'fulano_sutano/foo_bar');
      assert.equal(utils.pathize('Hoge::Fulano::FooController'), 'hoge/fulano/foo');
      assert.equal(utils.pathize('HogePage::FulanoSutano::FooBarController'), 'hoge_page/fulano_sutano/foo_bar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(utils.pathize());
    },
  },
  
}).export(module);
