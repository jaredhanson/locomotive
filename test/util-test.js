var vows = require('vows');
var assert = require('assert');
var util = require('util');
var _util = require('locomotive/util')


vows.describe('util').addBatch({
  
  'controllerize': {
    'should normalize underscore notation': function () {
      assert.equal(_util.controllerize('foo_bar_baz'), 'FooBarBazController');
      assert.equal(_util.controllerize('fulano/foo'), 'Fulano::FooController');
      assert.equal(_util.controllerize('fulano_sutano/foo_bar'), 'FulanoSutano::FooBarController');
      assert.equal(_util.controllerize('hoge/fulano/foo'), 'Hoge::Fulano::FooController');
      assert.equal(_util.controllerize('hoge_page/fulano_sutano/foo_bar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(_util.controllerize('fooBarBaz'), 'FooBarBazController');
      assert.equal(_util.controllerize('fulanoSutano/fooBar'), 'FulanoSutano::FooBarController');
      assert.equal(_util.controllerize('hogePage/fulanoSutano/fooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(_util.controllerize('FooBarBaz'), 'FooBarBazController');
      assert.equal(_util.controllerize('FulanoSutano/FooBar'), 'FulanoSutano::FooBarController');
      assert.equal(_util.controllerize('HogePage/FulanoSutano/FooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should preserve normalized forms': function () {
      assert.equal(_util.controllerize('FooController'), 'FooController');
      assert.equal(_util.controllerize('Bar::FooController'), 'Bar::FooController');
      assert.equal(_util.controllerize('Baz::Bar::FooController'), 'Baz::Bar::FooController');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(_util.controllerize());
    },
  },
  
  'decontrollerize': {
    'should denormalize to underscore notation': function () {
      assert.equal(_util.decontrollerize('FooController'), 'foo');
      assert.equal(_util.decontrollerize('FooBarBazController'), 'foo_bar_baz');
      assert.equal(_util.decontrollerize('Fulano::FooController'), 'fulano/foo');
      assert.equal(_util.decontrollerize('FulanoSutano::FooBarController'), 'fulano_sutano/foo_bar');
      assert.equal(_util.decontrollerize('Hoge::Fulano::FooController'), 'hoge/fulano/foo');
      assert.equal(_util.decontrollerize('HogePage::FulanoSutano::FooBarController'), 'hoge_page/fulano_sutano/foo_bar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(_util.decontrollerize());
    },
  },
  
  'actionize': {
    'should normalize underscore notation': function () {
      assert.equal(_util.actionize('foo_bar'), 'fooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(_util.actionize('fooBar'), 'fooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(_util.actionize('FooBar'), 'fooBar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(_util.actionize());
    },
  },
  
  'helperize': {
    'should normalize underscore notation': function () {
      assert.equal(_util.helperize('foo_bar', 'Path'), 'fooBarPath');
      assert.equal(_util.helperize('foo_bar', 'URL'), 'fooBarURL');
      assert.equal(_util.helperize('foo_bar'), 'fooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(_util.helperize('fooBar', 'Path'), 'fooBarPath');
      assert.equal(_util.helperize('fooBar', 'URL'), 'fooBarURL');
      assert.equal(_util.helperize('fooBar'), 'fooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(_util.helperize('FooBar', 'Path'), 'fooBarPath');
      assert.equal(_util.helperize('FooBar', 'URL'), 'fooBarURL');
      assert.equal(_util.helperize('FooBar'), 'fooBar');
    },
    'should return empty string if argument is empty string': function () {
      assert.equal(_util.helperize(''), '');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(_util.helperize());
    },
  },
  
  'moduleize': {
    'should normalize underscore notation': function () {
      assert.equal(_util.moduleize('foo_bar_baz'), 'FooBarBaz');
      assert.equal(_util.moduleize('fulano/foo'), 'Fulano::Foo');
      assert.equal(_util.moduleize('fulano_sutano/foo_bar'), 'FulanoSutano::FooBar');
      assert.equal(_util.moduleize('hoge/fulano/foo'), 'Hoge::Fulano::Foo');
      assert.equal(_util.moduleize('hoge_page/fulano_sutano/foo_bar'), 'HogePage::FulanoSutano::FooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(_util.moduleize('fooBarBaz'), 'FooBarBaz');
      assert.equal(_util.moduleize('fulanoSutano/fooBar'), 'FulanoSutano::FooBar');
      assert.equal(_util.moduleize('hogePage/fulanoSutano/fooBar'), 'HogePage::FulanoSutano::FooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(_util.moduleize('FooBarBaz'), 'FooBarBaz');
      assert.equal(_util.moduleize('FulanoSutano/FooBar'), 'FulanoSutano::FooBar');
      assert.equal(_util.moduleize('HogePage/FulanoSutano/FooBar'), 'HogePage::FulanoSutano::FooBar');
    },
    'should return empty string if argument is empty string': function () {
      assert.equal(_util.moduleize(''), '');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(_util.moduleize());
    },
  },
  
}).export(module);
