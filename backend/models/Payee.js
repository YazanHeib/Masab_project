const mongoose = require('mongoose');

const payeeSchema = new mongoose.Schema({
  type: { type: String, enum: ['EMPLOYEE', 'SUPPLIER', 'PENSION'], required: true },
  firstName: String,
  lastName: String,
  bank: String,
  branch: String,
  account: String,
  email: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Payee', payeeSchema);