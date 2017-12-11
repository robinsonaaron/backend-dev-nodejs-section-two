const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const accountCtrl = require('./account.ctrl');

const expect = chai.expect;
chai.use(sinonChai);

describe('Account Controller', () => {
  let accountService;
  let custSatisfactionService;
  let req;
  let res;
  let next;

  before(() => {
    accountService = {
      getAccountData: () => {},
      formatAccountData: () => {}
    };
    custSatisfactionService = {
      getSatisfactionData: () => {}
    };
    req = { params: { accountNbr: '100' }, log: { info: () => {} } };
    res = {
      statusCode: null,
      status: (code) => {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy()
    };
    next = sinon.spy();

    sinon.stub(accountService, 'getAccountData', (val) => {
      return Promise.resolve(val);
    });

    sinon.stub(accountService, 'formatAccountData', (val) => {
      return Promise.resolve(val);
    });

    sinon.stub(custSatisfactionService, 'getSatisfactionData', () => {
      return Promise.resolve({ rating: 'Very satisfied' });
    });
  });
  afterEach(() => {
    accountService.getAccountData.reset();
    accountService.formatAccountData.reset();
    custSatisfactionService.getSatisfactionData.reset();
    res.json.reset();
    next.reset();
    res.statusCode = null;
  });

  it('should be a function', () => {
    expect(accountCtrl).to.be.a('function');
  });
  it('should return a function', () => {
    var accountController = accountCtrl();
    expect(accountController).to.be.a('function');
  });
  it('should call account & customer satisfaction service functions', function () {
    var accountController = accountCtrl(accountService, custSatisfactionService);
    return accountController(req, res, next)
      .then(() => {
        expect(accountService.getAccountData.calledOnce).to.be.true;
        expect(accountService.getAccountData.calledWith('100')).to.be.true;
        expect(custSatisfactionService.getSatisfactionData.calledOnce).to.be.true;
        expect(accountService.formatAccountData.calledOnce).to.be.true;
        expect(accountService.formatAccountData.calledWith([
          '100',
          { rating: 'Very satisfied' }
        ])).to.be.true;
      });
  });
  it('should call send a 200 status with the result', () => {
    var accountController = accountCtrl(accountService, custSatisfactionService);
    return accountController(req, res, next)
      .then(() => {
        expect(next.calledOnce).to.be.false;
        expect(res.statusCode).to.equal(200);
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.calledWith([
          '100',
          { rating: 'Very satisfied' }
        ])).to.be.true;
      });
  });
  it('should call next when an error is caught', function () {
    sinon.mock(accountService, 'getAccountData', function () {
      return Promise.reject('Test error');
    });
    const accountController = accountCtrl(accountService, custSatisfactionService);
    return accountController(req, res, next)
      .catch(() => {
        expect(next.calledOnce).to.be.true;
        expect(next.calledWith('Test error')).to.be.true;
      });
  });
});
