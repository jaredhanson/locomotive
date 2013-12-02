/* global describe, it, expect */

var locomotive = require('..')
  , Application = require('../lib/locomotive/application')

describe('locomotive', function() {
  
  it('should expose singleton application', function() {
    expect(locomotive).to.be.an('object');
    expect(locomotive).to.be.an.instanceOf(Application);
  });
  
  it('should export version', function() {
    expect(locomotive.version).to.be.a('string');
  });
  
  it('should export constructors', function() {
    expect(locomotive.Application).to.equal(locomotive.Locomotive);
    expect(locomotive.Application).to.be.a('function');
    expect(locomotive.Controller).to.be.a('function');
  });
  
});
