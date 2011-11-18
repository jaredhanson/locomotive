var vows = require('vows');
var assert = require('assert');
var util = require('util');
var helpers = require('locomotive/helpers/url');


vows.describe('URLHelpers').addBatch({
  
  'linkTo': {
    'should build correct tag with name and url': function () {
      assert.equal(helpers.linkTo('My Account', '/account'), '<a href="/account">My Account</a>');
    },
  },
  
  'urlFor': {
    'should build correct tag with name and url': function () {
      assert.equal(helpers.linkTo('My Account', '/account'), '<a href="/account">My Account</a>');
    },
  },
  
}).export(module);
