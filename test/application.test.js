var locomotive = require('..')
  , Application = require('../lib/locomotive/application')

describe('Application', function() {
  
  describe('#format', function() {
    var app = new Application();
    
    it('should register format to engine as string argument', function() {
      app.format('json', 'jsonb');
      expect(Object.keys(app._formats)).to.have.length(1);
      expect(app._formats['json']).to.be.an('object');
      expect(app._formats['json'].engine).to.equal('jsonb');
      expect(app._formats['json'].extension).to.be.undefined;
    });
    
    it('should register format to engine as option', function() {
      app.format('xml', { engine: 'xmlb' });
      expect(Object.keys(app._formats)).to.have.length(2);
      expect(app._formats['xml']).to.be.an('object');
      expect(app._formats['xml'].engine).to.equal('xmlb');
      expect(app._formats['xml'].extension).to.be.undefined;
    });
    
    it('should register format to explicit extension as option', function() {
      app.format('html', { extension: '.jade' });
      expect(Object.keys(app._formats)).to.have.length(3);
      expect(app._formats['html']).to.be.an('object');
      expect(app._formats['html'].extension).to.equal('.jade');
      expect(app._formats['html'].engine).to.be.undefined;
    });
  });
  
});
