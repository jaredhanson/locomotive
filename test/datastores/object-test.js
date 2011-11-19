var vows = require('vows');
var assert = require('assert');
var util = require('util');
var datastore = require('locomotive/datastores/object');


vows.describe('ObjectDataStore').addBatch({
  
  'datastore': {
    topic: function() {
      return datastore;
    },
    
    'should return Object for instances of Object': function (datastore) {
      var obj = new Object();
      assert.equal(datastore.recordOf(obj), 'Object');
    },
    'should return Animal for instances of Animal': function (datastore) {
      function Animal() {};
      var obj = new Animal();
      assert.equal(datastore.recordOf(obj), 'Animal');
    },
    'should return null for numbers': function (datastore) {
      assert.isNull(datastore.recordOf(123));
    },
    'should return null for strings': function (datastore) {
      assert.isNull(datastore.recordOf('string'));
    },
  },

}).export(module);
