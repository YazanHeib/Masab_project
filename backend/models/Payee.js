const mongoose = require('mongoose');

const payeeSchema = new mongoose.Schema({
  type: { type: String, enum: ['EMPLOYEE', 'SUPPLIER', 'PENSION'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bank: { type: String, required: true },
  branch: { type: String, required: true },
  account: { type: String, required: true },
  email: { type: String, required: true },
  isActive: Boolean
});

module.exports = mongoose.model('Payee', payeeSchema);
