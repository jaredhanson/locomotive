var vows = require('vows');
var assert = require('assert');
var utils = require('locomotive/utils')


vows.describe('util').addBatch({
  
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
  
  'decontrollerize': {
    'should denormalize to underscore notation': function () {
      assert.equal(utils.decontrollerize('FooController'), 'foo');
      assert.equal(utils.decontrollerize('FooBarBazController'), 'foo_bar_baz');
      assert.equal(utils.decontrollerize('Fulano::FooController'), 'fulano/foo');
      assert.equal(utils.decontrollerize('FulanoSutano::FooBarController'), 'fulano_sutano/foo_bar');
      assert.equal(utils.decontrollerize('Hoge::Fulano::FooController'), 'hoge/fulano/foo');
      assert.equal(utils.decontrollerize('HogePage::FulanoSutano::FooBarController'), 'hoge_page/fulano_sutano/foo_bar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(utils.decontrollerize());
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
    'should normalize underscore notation': function () {
      assert.equal(utils.helperize('foo_bar', 'Path'), 'fooBarPath');
      assert.equal(utils.helperize('foo_bar', 'Path', true), 'FooBarPath');
      assert.equal(utils.helperize('foo_bar', 'URL'), 'fooBarURL');
      assert.equal(utils.helperize('foo_bar', 'URL', true), 'FooBarURL');
      assert.equal(utils.helperize('foo_bar'), 'fooBar');
      assert.equal(utils.helperize('foo_bar', true), 'FooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(utils.helperize('fooBar', 'Path'), 'fooBarPath');
      assert.equal(utils.helperize('fooBar', 'Path', true), 'FooBarPath');
      assert.equal(utils.helperize('fooBar', 'URL'), 'fooBarURL');
      assert.equal(utils.helperize('fooBar', 'URL', true), 'FooBarURL');
      assert.equal(utils.helperize('fooBar'), 'fooBar');
      assert.equal(utils.helperize('fooBar', true), 'FooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(utils.helperize('FooBar', 'Path'), 'fooBarPath');
      assert.equal(utils.helperize('FooBar', 'Path', true), 'FooBarPath');
      assert.equal(utils.helperize('FooBar', 'URL'), 'fooBarURL');
      assert.equal(utils.helperize('FooBar', 'URL', true), 'FooBarURL');
      assert.equal(utils.helperize('FooBar'), 'fooBar');
      assert.equal(utils.helperize('FooBar', true), 'FooBar');
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
  
}).export(module);
