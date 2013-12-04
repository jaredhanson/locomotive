var helpers = require('../../lib/helpers');
  

describe('helpers', function() {
  
  it('should export tag helpers', function() {
    expect(helpers.tag).to.be.a('function');
    expect(helpers.openTag).to.be.a('function');
    expect(helpers.closeTag).to.be.a('function');
  });
  
  it('should export URL helpers', function() {
    expect(helpers.linkTo).to.be.a('function');
    expect(helpers.mailTo).to.be.a('function');
  });
  
});
