/* global describe, it, before, expect */

var Instantiator = require('../lib/instantiator');

describe('Instantiator', function() {
  
  describe('without mechanisms', function() {
    var instantiator = new Instantiator();
    var error;
    
    before(function(done) {
      instantiator.instantiate({}, 'foo', function(err) {
        error = err;
        return done();
      });
    });
    
    it('should call callback', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Unable to instantiate 'foo'");
    });
  });
  
});
