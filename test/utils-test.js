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
  
  'controllerize': {
    'should normalize underscore notation': function () {
      assert.equal(utils.controllerize('foo_bar_baz'), 'FooBarBazController');
      assert.equal(utils.controllerize('foo_bar_baz_controller'), 'FooBarBazController');
      assert.equal(utils.controllerize('fulano/foo'), 'Fulano::FooController');
      assert.equal(utils.controllerize('fulano_sutano/foo_bar'), 'FulanoSutano::FooBarController');
      assert.equal(utils.controllerize('hoge/fulano/foo'), 'Hoge::Fulano::FooController');
      assert.equal(utils.controllerize('hoge_page/fulano_sutano/foo_bar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(utils.controllerize('fooBarBaz'), 'FooBarBazController');
      assert.equal(utils.controllerize('fooBarBazController'), 'FooBarBazController');
      assert.equal(utils.controllerize('fulanoSutano/fooBar'), 'FulanoSutano::FooBarController');
      assert.equal(utils.controllerize('hogePage/fulanoSutano/fooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(utils.controllerize('FooBarBaz'), 'FooBarBazController');
      assert.equal(utils.controllerize('FooBarBazController'), 'FooBarBazController');
      assert.equal(utils.controllerize('FulanoSutano/FooBar'), 'FulanoSutano::FooBarController');
      assert.equal(utils.controllerize('HogePage/FulanoSutano/FooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should preserve normalized forms': function () {
      assert.equal(utils.controllerize('FooController'), 'FooController');
      assert.equal(utils.controllerize('Bar::FooController'), 'Bar::FooController');
      assert.equal(utils.controllerize('Baz::Bar::FooController'), 'Baz::Bar::FooController');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(utils.controllerize());
    },
  },
  
  'actionize': {
    'should normalize underscore notation': function () {
      assert.equal(utils.actionize('foo_bar'), 'fooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(utils.actionize('fooBar'), 'fooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(utils.actionize('FooBar'), 'fooBar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(utils.actionize());
    },
  },
  
  'helperize': {
    'should normalize generic notation': function () {
      assert.equal(utils.helperize('foo'), 'foo');
      assert.equal(utils.helperize('foo', 'Path'), 'fooPath');
      assert.equal(utils.helperize('foo', 'URL'), 'fooURL');
      assert.equal(utils.helperize('edit', 'foo', 'path'), 'editFooPath');
    },
    'should normalize underscore notation': function () {
      assert.equal(utils.helperize('foo_bar'), 'fooBar');
      assert.equal(utils.helperize('foo_bar', 'Path'), 'fooBarPath');
      assert.equal(utils.helperize('foo_bar', 'URL'), 'fooBarURL');
      assert.equal(utils.helperize('edit', 'foo_bar', 'path'), 'editFooBarPath');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(utils.helperize('fooBar'), 'fooBar');
      assert.equal(utils.helperize('fooBar', 'Path'), 'fooBarPath');
      assert.equal(utils.helperize('fooBar', 'URL'), 'fooBarURL');
      assert.equal(utils.helperize('edit', 'fooBar', 'path'), 'editFooBarPath');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(utils.helperize('FooBar'), 'fooBar');
      assert.equal(utils.helperize('FooBar', 'Path'), 'fooBarPath');
      assert.equal(utils.helperize('FooBar', 'URL'), 'fooBarURL');
      assert.equal(utils.helperize('Edit', 'FooBar', 'Path'), 'editFooBarPath');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(utils.helperize());
    },
  },
  
  'moduleize': {
    'should normalize underscore notation': function () {
      assert.equal(utils.moduleize('foo_bar_baz'), 'FooBarBaz');
      assert.equal(utils.moduleize('fulano/foo'), 'Fulano::Foo');
      assert.equal(utils.moduleize('fulano_sutano/foo_bar'), 'FulanoSutano::FooBar');
      assert.equal(utils.moduleize('hoge/fulano/foo'), 'Hoge::Fulano::Foo');
      assert.equal(utils.moduleize('hoge_page/fulano_sutano/foo_bar'), 'HogePage::FulanoSutano::FooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(utils.moduleize('fooBarBaz'), 'FooBarBaz');
      assert.equal(utils.moduleize('fulanoSutano/fooBar'), 'FulanoSutano::FooBar');
      assert.equal(utils.moduleize('hogePage/fulanoSutano/fooBar'), 'HogePage::FulanoSutano::FooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(utils.moduleize('FooBarBaz'), 'FooBarBaz');
      assert.equal(utils.moduleize('FulanoSutano/FooBar'), 'FulanoSutano::FooBar');
      assert.equal(utils.moduleize('HogePage/FulanoSutano/FooBar'), 'HogePage::FulanoSutano::FooBar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(utils.moduleize());
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
