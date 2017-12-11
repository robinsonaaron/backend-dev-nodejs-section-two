require('dotenv').config();
const chai = require('chai');

const dashboardService = require('./dashboard.service');
const mongodb = require('../utils/mongo.util');

const expect = chai.expect;

describe('Dashboard Service', () => {
  before(() => {
    mongodb.connect();
  });
  afterEach(() => {
    dashboardService.logger = null;
  });
  after(() => {
    mongodb.disconnect();
  });

  it('should be an object with correct properties & methods', () => {
    expect(dashboardService).to.be.an('object');
    expect(dashboardService).to.have.all.keys([
      'calcDeposits',
      'calcWithdrawals',
      'calcInvoices',
      'queryDashboard',
      'composeDashboardData',
      'configure',
      'logger'
    ]);
  });

  describe('calcDeposits()', () => {
    it('should be a function', () => {
      expect(dashboardService.calcDeposits).to.be.a('function');
    });
    it('should return an aggregate number for deposits', () => {
      return dashboardService.calcDeposits()
        .then((depositAgg) => {
          expect(depositAgg).to.be.an('array');
          expect(depositAgg[0]).to.be.an('object');
          expect(depositAgg[0].deposits).to.equal(126826.72);
        });
    });
  });

  describe('calcWithdrawals()', () => {
    it('should be a function', () => {
      expect(dashboardService.calcWithdrawals).to.be.a('function');
    });
    it('should return an aggregate number for payments and withdrawals', () => {
      return dashboardService.calcWithdrawals()
        .then(function (withdrawalAgg) {
          expect(withdrawalAgg).to.be.an('array');
          expect(withdrawalAgg[0]).to.be.an('object');
          expect(withdrawalAgg[0].withdrawals).to.equal(255574.52999999982);
        });
    });
  });

  describe('calcInvoices()', () => {
    it('should be a function', () => {
      expect(dashboardService.calcInvoices).to.be.a('function');
    });
    it('should return an aggregate number for invoices', () => {
      return dashboardService.calcInvoices()
        .then(function (invoiceAgg) {
          expect(invoiceAgg).to.be.an('array');
          expect(invoiceAgg[0]).to.be.an('object');
          expect(invoiceAgg[0].invoices).to.equal(119584.27000000003);
        });
    });
  });

  describe('queryDashboard()', () => {
    it('should be a function', () => {
      expect(dashboardService.queryDashboard).to.be.a('function');
    });
    it('should return an array with the result of all of the aggregate functions', () => {
      var expectedResult = [
        [{ deposits: 126826.72 }],
        [{ withdrawals: 255574.52999999982 }],
        [{ invoices: 119584.27000000003 }]
      ];

      return dashboardService.queryDashboard()
        .then((results) => {
          expect(results).to.be.an('array');
          expect(results.length).to.equal(3);
          expect(results[0]).to.be.an('array');
          expect(results[1]).to.be.an('array');
          expect(results[2]).to.be.an('array');
          expect(results).to.deep.equal(expectedResult);
        });
    });
  });

  describe('composeDashboardData()', () => {
    it('should be a function', () => {
      expect(dashboardService.composeDashboardData).to.be.a('function');
    });
    it('should return a formatted data object', () => {
      const dashData = [
        [{ deposits: 126826.72 }],
        [{ withdrawals: 255574.52999999982 }],
        [{ invoices: 119584.27000000003 }]
      ];
      const expectedResult = {
        depositAmt: 126826.72,
        withdrawalAmt: 255574.53,
        invoiceAmt: 119584.27,
        onHandAmt: -128747.81
      };

      const result = dashboardService.composeDashboardData(dashData);
      expect(result).to.be.an('object');
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('configure()', () => {
    it('should be a function', () => {
      expect(dashboardService.configure).to.be.a('function');
    });
    it('should set the value of logger', () => {
      const logger = {
        child: (val) => {
          return val;
        }
      };

      dashboardService.configure(logger);

      expect(dashboardService.logger).to.deep.equal({ service: 'dashboard' });
    });
  });
});
