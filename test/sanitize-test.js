var vows = require('vows');
var assert = require('assert');
var sanitize = require('locomotive/sanitize');
var util = require('util');


vows.describe('sanitize').addBatch({
  
  'controllerize': {
    'should normalize underscore notation': function () {
      assert.equal(sanitize.controllerize('foo_bar_baz'), 'FooBarBazController');
      assert.equal(sanitize.controllerize('fulano/foo'), 'Fulano::FooController');
      assert.equal(sanitize.controllerize('fulano_sutano/foo_bar'), 'FulanoSutano::FooBarController');
      assert.equal(sanitize.controllerize('hoge/fulano/foo'), 'Hoge::Fulano::FooController');
      assert.equal(sanitize.controllerize('hoge_page/fulano_sutano/foo_bar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(sanitize.controllerize('fooBarBaz'), 'FooBarBazController');
      assert.equal(sanitize.controllerize('fulanoSutano/fooBar'), 'FulanoSutano::FooBarController');
      assert.equal(sanitize.controllerize('hogePage/fulanoSutano/fooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(sanitize.controllerize('FooBarBaz'), 'FooBarBazController');
      assert.equal(sanitize.controllerize('FulanoSutano/FooBar'), 'FulanoSutano::FooBarController');
      assert.equal(sanitize.controllerize('HogePage/FulanoSutano/FooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should preserve normalized forms': function () {
      assert.equal(sanitize.controllerize('FooController'), 'FooController');
      assert.equal(sanitize.controllerize('Bar::FooController'), 'Bar::FooController');
      assert.equal(sanitize.controllerize('Baz::Bar::FooController'), 'Baz::Bar::FooController');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(sanitize.controllerize());
    },
  },
  
  'decontrollerize': {
    'should denormalize to underscore notation': function () {
      assert.equal(sanitize.decontrollerize('FooController'), 'foo');
      assert.equal(sanitize.decontrollerize('FooBarBazController'), 'foo_bar_baz');
      assert.equal(sanitize.decontrollerize('Fulano::FooController'), 'fulano/foo');
      assert.equal(sanitize.decontrollerize('FulanoSutano::FooBarController'), 'fulano_sutano/foo_bar');
      assert.equal(sanitize.decontrollerize('Hoge::Fulano::FooController'), 'hoge/fulano/foo');
      assert.equal(sanitize.decontrollerize('HogePage::FulanoSutano::FooBarController'), 'hoge_page/fulano_sutano/foo_bar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(sanitize.decontrollerize());
    },
  },
  
  'actionize': {
    'should normalize underscore notation': function () {
      assert.equal(sanitize.actionize('foo_bar'), 'fooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(sanitize.actionize('fooBar'), 'fooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(sanitize.actionize('FooBar'), 'fooBar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(sanitize.actionize());
    },
  },
  
  'helperize': {
    'should normalize underscore notation': function () {
      assert.equal(sanitize.helperize('foo_bar', 'Path'), 'fooBarPath');
      assert.equal(sanitize.helperize('foo_bar', 'URL'), 'fooBarURL');
      assert.equal(sanitize.helperize('foo_bar'), 'fooBar');
    },
    'should normalize lower camelcase notation': function () {
      assert.equal(sanitize.helperize('fooBar', 'Path'), 'fooBarPath');
      assert.equal(sanitize.helperize('fooBar', 'URL'), 'fooBarURL');
      assert.equal(sanitize.helperize('fooBar'), 'fooBar');
    },
    'should normalize upper camelcase notation': function () {
      assert.equal(sanitize.helperize('FooBar', 'Path'), 'fooBarPath');
      assert.equal(sanitize.helperize('FooBar', 'URL'), 'fooBarURL');
      assert.equal(sanitize.helperize('FooBar'), 'fooBar');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(sanitize.helperize());
    },
  },
  
}).export(module);
