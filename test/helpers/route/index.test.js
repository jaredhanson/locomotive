var chai = require('chai')
  , routeHelper = require('../../../lib/locomotive/helpers/route')
  , dynamicHelpers = require('../../../lib/locomotive/helpers/dynamic');
  

describe('helpers/route', function() {
  
  describe('Path', function() {
  
    describe('without placeholder', function() {
      var urlHelper;
    
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
            urlHelper = helper;
            return done();
          });
      });
    
      it('should build correct tag to controller action with text', function() {
        expect(urlHelper()).to.equal('/songs');
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
    
      it('should build correct tag to controller action with text', function() {
        expect(urlHelper()).to.equal('http://www.example.com/songs');
      });
    });
    
  });
  
});
