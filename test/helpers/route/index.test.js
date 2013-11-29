var chai = require('chai')
  , routeHelper = require('../../../lib/locomotive/helpers/route')
  , dynamicHelpers = require('../../../lib/locomotive/helpers/dynamic');
  

describe('helpers/route', function() {
  
  describe('Path', function() {
  
    describe('without placeholder', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('songs', 'index', [], true), 'test', 'show')
          .app(function(app) {
            app.route('/songs', 'songs', 'index');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
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
        chai.locomotive.helper(routeHelper('songs', 'index', [ 'id' ], true), 'test', 'show')
          .app(function(app) {
            app.route('/songs/:id', 'songs', 'index');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
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
      });
      it('should build correct path with string', function() {
        expect(pathHelper('mr-jones')).to.equal('/songs/mr-jones');
      });
      it('should build correct path with object id', function() {
        expect(pathHelper({ id: 101 })).to.equal('/songs/101');
      });
    });
    
  });
  
  describe('URL', function() {
  
    describe('without placeholder', function() {
      var urlHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('songs', 'index', []), 'test', 'show')
          .app(function(app) {
            app.route('/songs', 'songs', 'index');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlHelper = helper;
            return done();
          });
      });
    
      it('should build correct URL', function() {
        expect(urlHelper()).to.equal('http://www.example.com/songs');
      });
    });
    
    describe('with one placeholder', function() {
      var urlHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('songs', 'index', [ 'id' ]), 'test', 'show')
          .app(function(app) {
            app.route('/songs/:id', 'songs', 'index');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlHelper = helper;
            return done();
          });
      });
    
      it('should build correct path with number', function() {
        expect(urlHelper(7)).to.equal('http://www.example.com/songs/7');
      });
      it('should build correct path with string', function() {
        expect(urlHelper('mr-jones')).to.equal('http://www.example.com/songs/mr-jones');
      });
      it('should build correct path with object id', function() {
        expect(urlHelper({ id: 101 })).to.equal('http://www.example.com/songs/101');
      });
    });
    
  });
  
});
