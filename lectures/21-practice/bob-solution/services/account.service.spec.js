require('dotenv').config();
const chai = require('chai');

const accountService = require('./account.service');
const mongodb = require('../utils/mongo.util');

const expect = chai.expect;

describe('Account Service', () => {
  before(() => {
    mongodb.connect();
  });
  afterEach(() => {
    accountService.logger = null;
  });
  after(() => {
    mongodb.disconnect();
  });

  it('should be an object with correct properties & methods', () => {
    expect(accountService).to.be.an('object');
    expect(accountService).to.have.all.keys([
      'getAccountData',
      'formatAccountData',
      'filterActivityType',
      'configure',
      'logger'
    ]);
  });

  describe('getAccountData()', () => {
    it('should be a function', () => {
      expect(accountService.getAccountData).to.be.a('function');
    });
    it('should return an object with the account data for the accountNbr', () => {
      return accountService.getAccountData('52640174')
        .then((accountData) => {
          expect(accountData).to.be.an('array');
          expect(accountData[0]).to.be.an('object');
          expect(accountData[0].amount).to.equal(12.51);
          expect(accountData[0].date).to.equal('Thu Feb 02 2012 00:00:00 GMT-0600 (CST)');
          expect(accountData[0].business).to.equal('Ziemann LLC');
          expect(accountData[0].name).to.equal('Auto Loan Account 1321');
          expect(accountData[0].type).to.equal('invoice');
          expect(accountData[0].account).to.equal('52640174');
        });
    });
  });

  describe('formatAccountData()', () => {
    it('should be a function', () => {
      expect(accountService.formatAccountData).to.be.a('function');
    });
    it('should return formatted account data', () => {
      const accountData = [
        [{
          business: 'Howdy Howdy Bo Bowdy',
          name: 'Super Secret Acount 007',
          type: 'invoice',
          amount: 100000.56,
          date: 'Now',
          account: '123456'
        }],
        'Very sophisticated message'
      ];
      const expectedResult = {
        message: 'Very sophisticated message',
        businessName: 'Howdy Howdy Bo Bowdy',
        account: '123456 - Super Secret Acount 007',
        invoices: [
          {
            amount: 100000.56,
            date: 'Now'
          }
        ],
        withdrawals: [],
        payments: [],
        deposits: []
      };

      const result = accountService.formatAccountData(accountData);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('filterActivityType()', () => {
    it('should be a function', () => {
      expect(accountService.filterActivityType).to.be.a('function');
    });
    it('should return a filtered and formatted list of account activity', () => {
      const accountData = [
        {
          business: 'Howdy Howdy Bo Bowdy',
          name: 'Super Secret Acount 007',
          type: 'invoice',
          amount: 100000.56,
          date: 'Later',
          account: '123456'
        },
        {
          business: 'Howdy Howdy Bo Bowdy',
          name: 'Super Secret Acount 007',
          type: 'deposit',
          amount: 200.14,
          date: 'Now',
          account: '123456'
        }
      ];
      const expectedResult = [{
        amount: 200.14,
        date: 'Now'
      }];

      const result = accountService.filterActivityType(accountData, 'deposit');
      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('object');
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('configure()', () => {
    it('should be a function', () => {
      expect(accountService.configure).to.be.a('function');
    });
    it('should set the value of logger', () => {
      const logger = {
        child: (val) => {
          return val;
        }
      };

      accountService.configure(logger);

      expect(accountService.logger).to.deep.equal({ service: 'account' });
    });
  });
});
