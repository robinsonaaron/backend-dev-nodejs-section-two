/* eslint no-console: 0 */
require('dotenv').config();
const request = require('request-promise');

const mongodb = require('../utils/mongo.util');
const Transaction = require('../models/transaction.model');

mongodb.createEventListeners();
mongodb.connect();

request({
  headers: {
    'BANK-OF-BACKENDDEV-AUTH': process.env.AUTH_HEADER_VAL
  },
  url: 'https://bob-legacy-185818.appspot.com/ledger',
  json: true
})
.then((transactions) => {
  return Transaction.insertMany(transactions);
})
.then((res) => {
  console.log(`${res.length} documents inserted.`);
  mongodb.disconnect();
})
.catch(function (err) {
  console.log(`Error migrating data from legacy system: ${err.message}`);
  mongodb.disconnect();
});
