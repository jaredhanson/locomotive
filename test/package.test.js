/* global describe, it, expect */

var maglev = require('..')
  , Application = require('../lib/application');

describe('maglev', function() {
  
  it('should expose singleton application', function() {
    expect(maglev).to.be.an('object');
    expect(maglev).to.be.an.instanceOf(Application);
  });
  
  it('should export version', function() {
    expect(maglev.version).to.be.a('string');
  });
  
  it('should export constructors', function() {
    expect(maglev.Application).to.equal(maglev.Maglev);
    expect(maglev.Application).to.be.a('function');
    expect(maglev.Controller).to.be.a('function');
  });
  
  it('should export boot phases', function() {
    expect(maglev.boot.controllers).to.be.a('function');
    expect(maglev.boot.views).to.be.a('function');
    expect(maglev.boot.routes).to.be.a('function');
    expect(maglev.boot.httpServer).to.be.a('function');
    expect(maglev.boot.httpServerCluster).to.be.a('function');
    
    expect(maglev.boot.di).to.be.an('object');
    expect(maglev.boot.di.routes).to.be.a('function');
  });
  
});
