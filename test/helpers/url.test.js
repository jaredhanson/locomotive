var helpers = require('../../lib/locomotive/helpers/url');
  

describe('helpers/url', function() {
  
  describe('mailTo', function() {
    it('should build correct tag with email', function() {
      expect(helpers.mailTo('johndoe@example.com')).to.equal('<a href="mailto:johndoe@example.com">johndoe@example.com</a>');
    });
    it('should build correct tag with email and options', function() {
      expect(helpers.mailTo('johndoe@example.com', { class: 'email' })).to.equal('<a class="email" href="mailto:johndoe@example.com">johndoe@example.com</a>');
    });
    it('should build correct tag with email and text', function() {
      expect(helpers.mailTo('johndoe@example.com', 'John Doe')).to.equal('<a href="mailto:johndoe@example.com">John Doe</a>');
    });
    it('should build correct tag with email, text, and options', function() {
      expect(helpers.mailTo('johndoe@example.com', 'John Doe', { class: 'email' })).to.equal('<a class="email" href="mailto:johndoe@example.com">John Doe</a>');
    });
    it('should escape URLs with spaces', function() {
      expect(helpers.mailTo('john doe@example.com', 'John Doe')).to.equal('<a href="mailto:john%20doe@example.com">John Doe</a>');
    });
    it('should escape text', function() {
      expect(helpers.mailTo('parents@example.com', 'Mom & Dad')).to.equal('<a href="mailto:parents@example.com">Mom &amp; Dad</a>');
    });
  });
  
});
