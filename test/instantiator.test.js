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
    
    it('should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Unable to instantiate 'foo'");
    });
  });
  
  describe('with sync mechanism', function() {
    
    describe('that instantiates', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod) {
        return Object.create(mod);
      });
    
      var instance;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          if (err) { return done(err); }
          instance = inst;
          return done();
        });
      });
    
      it('should instantiate', function() {
        expect(instance).to.be.an('object');
        expect(instance.bar).to.equal('baz');
      });
    });
    
    describe('that throws an exception', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod) {
        throw new Error('something went horribly wrong')
      });
    
      var instance, error;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          error = err;
          instance = inst;
          return done();
        });
      });
    
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });
      it('should not instantiate', function() {
        expect(instance).to.be.undefined;
      });
    });
  });
  
});
