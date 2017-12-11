require('dotenv').config();
const chai = require('chai');

const custSatisfactionService = require('./cust-satisfaction.service');

const expect = chai.expect;

describe('Customer Satisfaction Service', () => {
  it('should be an object with correct properties & methods', () => {
    expect(custSatisfactionService).to.be.an('object');
    expect(custSatisfactionService).to.have.all.keys([
      'getSatisfactionData',
      'authHeaderVal',
      'authUsername',
      'authPassword',
      'configure',
      'logger'
    ]);
  });

  describe('getSatisfactionData()', () => {
    it('should be a function', () => {
      expect(custSatisfactionService.getSatisfactionData).to.be.a('function');
    });
  });

  describe('configure()', () => {
    it('should be a function', () => {
      expect(custSatisfactionService.configure).to.be.a('function');
    });
    it('should set the value of logger', () => {
      const logger = {
        child: (val) => {
          return val;
        }
      };

      custSatisfactionService.configure(logger);

      expect(custSatisfactionService.logger).to.deep.equal({ service: 'cust-satisfaction' });
    });
  });
});
