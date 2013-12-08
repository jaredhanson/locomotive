/* global describe, it, before, expect */

var Resolver = require('../lib/resolver');

describe('Resolver', function() {
  
  describe('without mechanisms', function() {
    var resolver = new Resolver();
    
    it('should throw when resolving', function() {
      expect(function() {
        resolver.resolve('foo')
      }).to.throw("Unable to resolve 'foo'");
    });
  });
  
  describe('with one mechanism that resolves', function() {
    var resolver = new Resolver();
    resolver.use(function(id) {
      return 'ok-' + id;
    });
    
    it('should resolve using mechanism', function() {
      expect(resolver.resolve('foo')).to.equal('ok-foo');
    });
  });
  
  describe('with two mechanisms, the first of which resolves', function() {
    var resolver = new Resolver();
    resolver.use(function(id) {
      return 'ok1-' + id;
    });
    resolver.use(function(id) {
      return 'ok2-' + id;
    });
    
    it('should resolve using mechanism', function() {
      expect(resolver.resolve('foo')).to.equal('ok1-foo');
    });
  });
  
  describe('with two mechanisms, the second of which resolves', function() {
    var resolver = new Resolver();
    resolver.use(function(id) {
      return;
    });
    resolver.use(function(id) {
      return 'ok2-' + id;
    });
    
    it('should resolve using mechanism', function() {
      expect(resolver.resolve('foo')).to.equal('ok2-foo');
    });
  });
  
  describe('with two mechanisms scoped to prefix', function() {
    var resolver = new Resolver();
    resolver.use('foo', function(id) {
      return 'ok-foo-' + id;
    });
    resolver.use('bar', function(id) {
      return 'ok-bar-' + id;
    });
    
    it('should resolve in foo prefix', function() {
      expect(resolver.resolve('foo/baz')).to.equal('ok-foo-baz');
    });
    it('should resolve in bar prefix', function() {
      expect(resolver.resolve('bar/baz')).to.equal('ok-bar-baz');
    });
  });
  
});
