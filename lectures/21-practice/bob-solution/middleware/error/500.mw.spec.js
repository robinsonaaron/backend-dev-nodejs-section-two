const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const err500Middleware = require('./500.mw');

const expect = chai.expect;
chai.use(sinonChai);

describe('500 Middleware', () => {
  let req;
  let res;

  before(() => {
    req = { log: { error: sinon.spy() }, params: {} };
    res = {
      statusCode: null,
      status: (code) => {
        this.statusCode = code;
        return this;
      },
      send: sinon.spy()
    };
  });
  afterEach(() => {
    req.log.error.reset();
    res.statusCode = null;
    res.send.reset();
  });

  it('should be a function', () => {
    expect(err500Middleware).to.be.a('function');
  });
  it('should call req.log.error', () => {
    const expectedErrMsg = 'Internal server error: "Test error"';
    err500Middleware('Test error', req, res, null);

    expect(req.log.error.calledOnce).to.be.true;
    expect(req.log.error.calledWith(expectedErrMsg, req.params)).to.be.true;
  });
  it('should send a status of 500 with an error message', () => {
    err500Middleware('Test error', req, res, null);

    expect(res.statusCode).to.equal(500);
    expect(res.send.calledOnce).to.be.true;
    expect(res.send.calledWith('Internal server error: "Test error"')).to.be.true;
  });
});
