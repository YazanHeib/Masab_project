const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  bank: String,
  branch: String,
  account: String,
  email: String,
  mandateRef: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Customer', customerSchema);