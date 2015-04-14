/* global describe, it, expect */

var ds = require('../../lib/datastores/object');


describe('datastores/object', function() {
  
  it('should return Object for instances of Object', function() {
    var obj = {};
    expect(ds.recordOf(obj)).to.equal('Object');
  });
  
  it('should return Animal for instances of Animal', function() {
    function Animal() {}
    var obj = new Animal();
    expect(ds.recordOf(obj)).to.equal('Animal');
  });
  
  it('should return undefined for number primitives', function() {
    expect(ds.recordOf(1234)).to.be.undefined;
  });
  
  it('should return undefined for string primitives', function() {
    expect(ds.recordOf('string')).to.be.undefined;
  });
    
});
