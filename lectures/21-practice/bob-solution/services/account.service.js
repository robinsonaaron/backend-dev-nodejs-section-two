const Transaction = require('../models/transaction.model');
const _ = require('lodash');

module.exports = {
  getAccountData,
  formatAccountData,
  filterActivityType,
  configure,
  logger: null
};

function configure(logger) {
  // this.logger = logger.child({ service: 'account' });
}

function getAccountData(accountNbr) {
  // this.logger.debug('Retrieving info for account #' + accountNbr);
  return Transaction
    .find({ account: accountNbr })
    .exec();
}

function formatAccountData(accountData) {
  const accountTransactions = accountData[0];
  const custSatisfactionMsg = accountData[1];
  // this.logger.debug(`Account transactions returned: ${accountTransactions}`);
  // this.logger.debug(`Satisfaction response: ${custSatisfactionMsg}`);
  return {
    message: custSatisfactionMsg,
    businessName: accountTransactions[0].business,
    account: accountTransactions[0].account + ' - ' + accountTransactions[0].name,
    invoices: filterActivityType(accountTransactions, 'invoice'),
    withdrawals: filterActivityType(accountTransactions, 'withdrawal'),
    payments: filterActivityType(accountTransactions, 'payment'),
    deposits: filterActivityType(accountTransactions, 'deposit')
  };
}

function filterActivityType(accountData, activity) {
  // this.logger.debug(`Filtering activity type by -- ${activity}`);
  return _(accountData)
    .filter((transaction) => {
      return transaction.type === activity;
    })
    .map((transaction) => {
      return {
        amount: transaction.amount,
        date: transaction.date
      };
    })
    .value();
}
