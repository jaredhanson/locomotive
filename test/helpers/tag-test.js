var vows = require('vows');
var assert = require('assert');
var util = require('util');
var helpers = require('locomotive/helpers/tag');


vows.describe('TagHelpers').addBatch({
  
  'tag': {
    'should build correct tag': function () {
      assert.equal(helpers.tag('br'), '<br>');
    },
    'should build correct tag with close argument in second position': function () {
      assert.equal(helpers.tag('br', true), '<br/>');
    },
    'should build correct tag with options argument in second position': function () {
      assert.equal(helpers.tag('img', { src: '/image.png', width: 100, height: 60 }), '<img src="/image.png" width="100" height="60">');
    },
    'should build correct tag with options argument in second position and close argument in third position': function () {
      assert.equal(helpers.tag('img', { src: '/image.png', width: 100, height: 60 }, true), '<img src="/image.png" width="100" height="60"/>');
    },
    'should build correct tag with callback argument in second position': function () {
      assert.equal(helpers.tag('p', function() { return 'hello' }), '<p>hello</p>');
    },
    'should build correct tag with options argument in second position and callback argument in third position': function () {
      assert.equal(helpers.tag('p', { id: 'intro' }, function() { return 'hello' }), '<p id="intro">hello</p>');
    },
    'should build correct tag when callback does not return a value': function () {
      assert.equal(helpers.tag('p', function() { }), '<p/>');
    },
    'should build correct tag when callback returns an empty string': function () {
      assert.equal(helpers.tag('p', function() { return '' }), '<p/>');
    },
  },
  
}).export(module);
