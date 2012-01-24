var vows = require('vows');
var assert = require('assert');
var sanitize = require('locomotive/sanitize');
var util = require('util');


vows.describe('sanitize').addBatch({
  
  'controller': {
    'should normalize camilize notation': function () {
      assert.equal(sanitize.controller('FooBarBaz'), 'FooBarBazController');
      assert.equal(sanitize.controller('FulanoSutano/FooBar'), 'FulanoSutano::FooBarController');
      assert.equal(sanitize.controller('HogePage/FulanoSutano/FooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize lower camelize notation string': function () {
      assert.equal(sanitize.controller('fooBarBaz'), 'FooBarBazController');
      assert.equal(sanitize.controller('fulanoSutano/fooBar'), 'FulanoSutano::FooBarController');
      assert.equal(sanitize.controller('hogePage/fulanoSutano/fooBar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should normalize underscore notation': function () {
      assert.equal(sanitize.controller('foo_bar_baz'), 'FooBarBazController');
      assert.equal(sanitize.controller('fulano/foo'), 'Fulano::FooController');
      assert.equal(sanitize.controller('fulano_sutano/foo_bar'), 'FulanoSutano::FooBarController');
      assert.equal(sanitize.controller('hoge/fulano/foo'), 'Hoge::Fulano::FooController');
      assert.equal(sanitize.controller('hoge_page/fulano_sutano/foo_bar'), 'HogePage::FulanoSutano::FooBarController');
    },
    'should preserve normalized forms': function () {
      assert.equal(sanitize.controller('FooController'), 'FooController');
      assert.equal(sanitize.controller('Bar::FooController'), 'Bar::FooController');
      assert.equal(sanitize.controller('Baz::Bar::FooController'), 'Baz::Bar::FooController');
    },
    'should return null if argument is undefined': function () {
      assert.isNull(sanitize.controller());
    },
  },
  
}).export(module);
