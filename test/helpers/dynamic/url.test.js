var chai = require('chai')
  , helpers = require('../../../lib/locomotive/helpers/dynamic/url');
  

describe('helpers/dynamic/url', function() {
  
  describe('urlFor', function() {
    
    var urlFor;
    
    before(function(done) {
      chai.locomotive.dynamicHelper(helpers.urlFor, 'test', 'show')
        .app(function(app) {
          app.route('/test', 'test', 'index');
          app.route('/animals/:id', 'animals', 'show');
        })
        .req(function(req) {
          req.headers.host = 'www.example.com';
        })
        .create(function(err, helper) {
          if (err) { return done(err); }
          urlFor = helper;
          return done();
        });
    });
    
    it('should build correct URL for protocol, host, and pathname', function() {
      expect(urlFor({ protocol: 'https', host: 'www.example.net', pathname: 'welcome' })).to.equal('https://www.example.net/welcome');
    });
    
    it('should build correct URL for action of current controller', function() {
      expect(urlFor({ action: 'index' })).to.equal('http://www.example.com/test');
    });
    it('should build correct path for action of current controller', function() {
      expect(urlFor({ action: 'index', onlyPath: true })).to.equal('/test');
    });
    it('should build correct URL for action of current controller using protocol and host options', function() {
      expect(urlFor({ action: 'index', protocol: 'https', host: 'www.example.net' })).to.equal('https://www.example.net/test');
    });
    
    it('should build correct URL for controller action with id', function() {
      expect(urlFor({ controller: 'animals', action: 'show', id: '1234' })).to.equal('http://www.example.com/animals/1234');
    });
  });
  
});
