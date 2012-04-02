var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Namespace = require('locomotive/namespace');


vows.describe('Namespace').addBatch({
  
  'default namespace': {
    topic: function() {
      return new Namespace();
    },
    
    'should have empty name property': function (ns) {
      assert.equal(ns.path, '');
    },
    'should have empty module property': function (ns) {
      assert.equal(ns.module, '');
    },
    'should have empty helper property': function (ns) {
      assert.equal(ns.helper, '');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
    'should qualify controllers': function (ns) {
      assert.equal(ns.qcontroller('PhotosController'), 'PhotosController');
    },
    'should qualify helpers': function (ns) {
      assert.equal(ns.qhelper('photos'), 'photos');
    },
    'should qualify paths': function (ns) {
      assert.equal(ns.qpath('photos'), '/photos');
      assert.equal(ns.qpath('/photos'), '/photos');
    },
  },
  
  'namespace constructed with name': {
    topic: function() {
      return new Namespace('foo');
    },
    
    'should have name property': function (ns) {
      assert.equal(ns.path, 'foo');
    },
    'should have module property': function (ns) {
      assert.equal(ns.module, 'Foo');
    },
    'should have helper property': function (ns) {
      assert.equal(ns.helper, 'foo');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
    'should qualify controllers': function (ns) {
      assert.equal(ns.qcontroller('PhotosController'), 'Foo::PhotosController');
    },
    'should qualify helpers': function (ns) {
      assert.equal(ns.qhelper('photos'), 'fooPhotos');
    },
    'should qualify paths': function (ns) {
      assert.equal(ns.qpath('photos'), '/foo/photos');
      assert.equal(ns.qpath('/photos'), '/foo/photos');
    },
  },
  
  'namespace constructed with name and module option': {
    topic: function() {
      return new Namespace('foo', { module: 'Bar' });
    },
    
    'should have name property': function (ns) {
      assert.equal(ns.path, 'foo');
    },
    'should have module property': function (ns) {
      assert.equal(ns.module, 'Bar');
    },
    'should have helper property': function (ns) {
      assert.equal(ns.helper, 'foo');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
    'should qualify controllers': function (ns) {
      assert.equal(ns.qcontroller('PhotosController'), 'Bar::PhotosController');
    },
    'should qualify helpers': function (ns) {
      assert.equal(ns.qhelper('photos'), 'fooPhotos');
    },
    'should qualify paths': function (ns) {
      assert.equal(ns.qpath('photos'), '/foo/photos');
      assert.equal(ns.qpath('/photos'), '/foo/photos');
    },
  },
  
  'namespace constructed with name and helper option': {
    topic: function() {
      return new Namespace('foo', { helper: 'bar' });
    },
    
    'should have name property': function (ns) {
      assert.equal(ns.path, 'foo');
    },
    'should have module property': function (ns) {
      assert.equal(ns.module, 'Foo');
    },
    'should have helper property': function (ns) {
      assert.equal(ns.helper, 'bar');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
    'should qualify controllers': function (ns) {
      assert.equal(ns.qcontroller('PhotosController'), 'Foo::PhotosController');
    },
    'should qualify helpers': function (ns) {
      assert.equal(ns.qhelper('photos'), 'barPhotos');
    },
    'should qualify paths': function (ns) {
      assert.equal(ns.qpath('photos'), '/foo/photos');
      assert.equal(ns.qpath('/photos'), '/foo/photos');
    },
  },
  
  'namespace constructed with name and null module option': {
    topic: function() {
      return new Namespace('foo', { module: null });
    },
    
    'should have name property': function (ns) {
      assert.equal(ns.path, 'foo');
    },
    'should have module property': function (ns) {
      assert.equal(ns.module, '');
    },
    'should have helper property': function (ns) {
      assert.equal(ns.helper, 'foo');
    },
    'should not have parent property': function (ns) {
      assert.isNull(ns.parent);
    },
    'should qualify controllers': function (ns) {
      assert.equal(ns.qcontroller('PhotosController'), 'PhotosController');
    },
    'should qualify helpers': function (ns) {
      assert.equal(ns.qhelper('photos'), 'fooPhotos');
    },
    'should qualify paths': function (ns) {
      assert.equal(ns.qpath('photos'), '/foo/photos');
      assert.equal(ns.qpath('/photos'), '/foo/photos');
    },
  },
  
  'namespace with parent': {
    topic: function() {
      var admin = new Namespace('net');
      return new Namespace('http', {}, admin);
    },
    
    'should have name property': function (ns) {
      assert.equal(ns.path, 'http');
    },
    'should have module property': function (ns) {
      assert.equal(ns.module, 'Http');
    },
    'should have helper property': function (ns) {
      assert.equal(ns.helper, 'http');
    },
    'should have parent property': function (ns) {
      assert.isObject(ns.parent);
    },
    'should qualify controllers': function (ns) {
      assert.equal(ns.qcontroller('ProxiesController'), 'Net::Http::ProxiesController');
    },
    'should qualify helpers': function (ns) {
      assert.equal(ns.qhelper('photos'), 'netHttpPhotos');
    },
    'should qualify paths': function (ns) {
      assert.equal(ns.qpath('proxies'), '/net/http/proxies');
      assert.equal(ns.qpath('/proxies'), '/net/http/proxies');
    },
  },

}).export(module);
