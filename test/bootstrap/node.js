var chai = require('chai')
  , connect = require('chai-connect-middleware')
  , helpers = require('chai-locomotive-helpers');

chai.use(connect);
chai.use(helpers);

global.expect = chai.expect;
