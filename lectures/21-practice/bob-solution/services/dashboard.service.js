const Transaction = require('../models/transaction.model');
const _ = require('lodash');

const service = {
  calcDeposits,
  calcWithdrawals,
  calcInvoices,
  queryDashboard,
  composeDashboardData,
  configure,
  logger: null
};

function configure(logger) {
  // this.logger = logger.child({ service: 'dashboard' });
}

function calcDeposits() {
  // this.logger.debug('Calculating deposits...');
  return Transaction
    .aggregate([
      { $match: { type: 'deposit' } },
      { $group: { _id: null, deposits: { $sum: '$amount' } } },
      { $project: { _id: 0, deposits: 1 } }
    ])
    .exec();
}

function calcWithdrawals() {
  // this.logger.debug('Calculating withdrawals...');
  return Transaction
    .aggregate([
      { $match: { $or: [{ type: 'payment' }, { type: 'withdrawal' }] } },
      { $group: { _id: null, withdrawals: { $sum: '$amount' } } },
      { $project: { _id: 0, withdrawals: 1 } }
    ])
    .exec();
}

function calcInvoices() {
  // this.logger.debug('Calculating invoices...');
  return Transaction
    .aggregate([
      { $match: { type: 'invoice' } },
      { $group: { _id: null, invoices: { $sum: '$amount' } } },
      { $project: { _id: 0, invoices: 1 } }
    ])
    .exec();
}

function queryDashboard() {
  return Promise.all([
    service.calcDeposits(),
    service.calcWithdrawals(),
    service.calcInvoices()
  ]);
}

function composeDashboardData(dashData) {
  console.log('COMPOSE DASHBOARD DATA:');
  console.log(dashData);
  // this.logger.debug('Formatting dashboard data...');
  const flattenedData = _.flatten(dashData);
  const depositAmt = Math.round(flattenedData[0].deposits * 100) / 100;
  const withdrawalAmt = Math.round(flattenedData[1].withdrawals * 100) / 100;
  const invoiceAmt = Math.round(flattenedData[2].invoices * 100) / 100;
  const onHandAmt = depositAmt - withdrawalAmt;

  return {
    depositAmt,
    withdrawalAmt,
    invoiceAmt,
    onHandAmt
  };
}

module.exports = service;
