var chai = require('chai');

chai.use(require('chai-connect-middleware'));
chai.use(require('chai-locomotive-helpers'));

global.expect = chai.expect;
