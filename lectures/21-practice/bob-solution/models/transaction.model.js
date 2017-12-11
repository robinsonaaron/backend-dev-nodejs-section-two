const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const transactionSchema = new Schema({
  amount: Number,
  date: String,
  business: String,
  name: String,
  type: String,
  account: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
