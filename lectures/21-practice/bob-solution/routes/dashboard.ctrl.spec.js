const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const dashboardCtrl = require('./dashboard.ctrl');

const expect = chai.expect;
chai.use(sinonChai);

describe('Dashboard Controller', () => {
  let dashboardService;
  let req;
  let res;
  let next;

  before(() => {
    dashboardService = {
      queryDashboard: () => {},
      composeDashboardData: () => {}
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

    sinon.stub(dashboardService, 'queryDashboard', () => {
      return Promise.resolve({ data: '100' });
    });

    sinon.stub(dashboardService, 'composeDashboardData', (val) => {
      return Promise.resolve(val);
    });
  });

  afterEach(() => {
    dashboardService.queryDashboard.reset();
    dashboardService.composeDashboardData.reset();
    res.json.reset();
    next.reset();
    res.statusCode = null;
  });

  it('should be a function', () => {
    expect(dashboardCtrl).to.be.a('function');
  });

  it('should return a function', () => {
    const dashboardController = dashboardCtrl();
    expect(dashboardController).to.be.a('function');
  });
  it('should call account & customer satisfaction service functions', () => {
    const dashboardController = dashboardCtrl(dashboardService);
    return dashboardController(req, res, next)
      .then(() => {
        expect(dashboardService.queryDashboard.calledOnce).to.be.true;
        expect(dashboardService.composeDashboardData.calledOnce).to.be.true;
        expect(dashboardService.composeDashboardData.calledWith({
          data: '100'
        })).to.be.true;
      });
  });
  it('should call send a 200 status with the result', () => {
    const dashboardController = dashboardCtrl(dashboardService);
    return dashboardController(req, res, next)
      .then(() => {
        expect(next.calledOnce).to.be.false;
        expect(res.statusCode).to.equal(200);
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.calledWith({
          data: '100'
        })).to.be.true;
      });
  });
  it('should call next when an error is caught', () => {
    sinon.mock(dashboardService, 'queryDashboard', () => {
      return Promise.reject('Test error');
    });
    const dashboardController = dashboardCtrl(dashboardService);
    return dashboardController(req, res, next)
      .catch(() => {
        expect(next.calledOnce).to.be.true;
        expect(next.calledWith('Test error')).to.be.true;
      });
  });
});
