var utils = require('../lib/locomotive/utils');
  

describe('utils', function() {
  
  describe('underscore', function() {
    it('should preserve underscore strings', function() {
      expect(utils.underscore('foo_bar')).to.equal('foo_bar');
    });
    it('should preserve underscore strings in namespaces', function() {
      expect(utils.underscore('fulano_sutano/foo_bar')).to.equal('fulano_sutano/foo_bar');
    });
    
    it('should underscore lower camelcase strings', function() {
      expect(utils.underscore('fooBar')).to.equal('foo_bar');
    });
    it('should underscore lower camelcase strings with consequtive uppercase letters', function() {
      expect(utils.underscore('sslError')).to.equal('ssl_error');
    });
    it('should underscore lower camelcase strings in namespaces', function() {
      expect(utils.underscore('fulanoSutano/fooBar')).to.equal('fulano_sutano/foo_bar');
    });
    
    it('should underscore upper camelcase strings', function() {
      expect(utils.underscore('FooBar')).to.equal('foo_bar');
    });
    it('should underscore upper camelcase strings with consequtive uppercase letters', function() {
      expect(utils.underscore('SSLError')).to.equal('ssl_error');
    });
    it('should underscore upper camelcase strings in namespaces', function() {
      expect(utils.underscore('FulanoSutano/FooBar')).to.equal('fulano_sutano/foo_bar');
    });
    
    it('should underscore dasherized strings', function() {
      expect(utils.underscore('foo-bar')).to.equal('foo_bar');
    });
  });
  
  describe('extensionizeType', function() {
    it('should extensionize extensions', function() {
      expect(utils.extensionizeType('html')).to.equal('html');
    });
    it('should extensionize mime types', function() {
      expect(utils.extensionizeType('application/xml')).to.equal('xml');
    });
  });
  
  describe('normalizeType', function() {
    it('should extensionize extensions', function() {
      expect(utils.extensionizeType('html')).to.equal('html');
    });
    it('should extensionize mime types', function() {
      expect(utils.extensionizeType('application/xml')).to.equal('xml');
    });
  });
  
});
