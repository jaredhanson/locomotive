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
  
});
