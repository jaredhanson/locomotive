/* global describe, it, expect */

var locomotive = require('..')
  , Application = require('../lib/application')

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
  
  it('should export boot phases', function() {
    expect(locomotive.boot.controllers).to.be.a('function');
    expect(locomotive.boot.views).to.be.a('function');
    expect(locomotive.boot.routes).to.be.a('function');
    expect(locomotive.boot.httpServer).to.be.a('function');
    expect(locomotive.boot.httpServerCluster).to.be.a('function');
  });
  
});
