var chai = require('chai')
  , patternHelper = require('../../../lib/helpers/route/pattern');
  

describe('helpers/route/pattern', function() {
  
  describe('path', function() {
    
    describe('without placeholder', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(patternHelper.path('/songs'), 'test', 'show')
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            pathHelper = helper;
            return done();
          });
      });
    
      it('should build correct path', function() {
        expect(pathHelper()).to.equal('/songs');
      });
    });
    
    describe('with one placeholder', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(patternHelper.path('/songs/:id'), 'test', 'show')
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            pathHelper = helper;
            return done();
          });
      });
    
      it('should build correct path with number', function() {
        expect(pathHelper(7)).to.equal('/songs/7');
        expect(pathHelper(0)).to.equal('/songs/0');
      });
      it('should build correct path with string', function() {
        expect(pathHelper('mr-jones')).to.equal('/songs/mr-jones');
      });
      it('should build correct path with object id', function() {
        expect(pathHelper({ id: 101 })).to.equal('/songs/101');
        expect(pathHelper({ id: 0 })).to.equal('/songs/0');
      });
      it('should throw if incorrect number of arguments', function() {
        expect(function() {
          pathHelper()
        }).to.throw("Incorrect number of arguments passed to route helper for /songs/:id");
      });
    });
    
  });
  
});
