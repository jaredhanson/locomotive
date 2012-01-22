var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Namespace = require('locomotive/namespace');


vows.describe('Namespace').addBatch({
  
  'namespace constructed without arguments': {
    topic: function() {
      return new Namespace();
    },
    
    'should have empty name property': function (ns) {
      assert.equal(ns.name, '');
    },
    'should have empty module property': function (ns) {
      assert.equal(ns.module, '');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
  },
  
  'namespace constructed with name': {
    topic: function() {
      return new Namespace('foo');
    },
    
    'should have name property': function (ns) {
      assert.equal(ns.name, 'foo');
    },
    'should have module property': function (ns) {
      assert.equal(ns.module, 'foo');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
  },

}).export(module);
