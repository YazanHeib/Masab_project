const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bank: { type: String, required: true },
  branch: { type: String, required: true },
  account: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mandateRef: { type: String, required: true },
  isActive: Boolean
});

module.exports = mongoose.model('Customer', customerSchema);
