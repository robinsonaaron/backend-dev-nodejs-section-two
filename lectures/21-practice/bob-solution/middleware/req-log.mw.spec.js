const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const reqLogMiddleware = require('./req-log.mw');

const expect = chai.expect;
chai.use(sinonChai);

describe('Req Log Middleware', () => {
  it('should be a function', () => {
    expect(reqLogMiddleware).to.be.a('function');
  });

  it('should return a function', () => {
    const result = reqLogMiddleware(null);
    expect(result).to.be.a('function');
  });

  it('should set req.log = to the logger argument', () => {
    var logger = { bacon: 'eggs' };
    var req = {};
    var stageLogger = reqLogMiddleware(logger);

    stageLogger(req, {}, () => {});

    expect(req.log).to.deep.equal(logger);
  });

  it('should call next', () => {
    var next = sinon.spy();
    var stageLogger = reqLogMiddleware({});

    stageLogger({}, {}, next);

    expect(next.calledOnce).to.be.true;
  });
});
