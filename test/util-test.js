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
    'should return null if argument is undefined': function () {
      assert.isNull(_util.helperize());
    },
  },
  
}).export(module);
