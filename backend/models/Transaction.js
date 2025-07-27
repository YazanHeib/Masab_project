const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['PAYMENT', 'CHARGE'], required: true },
  category: { type: String, enum: ['SALARY', 'SUPPLIER', 'PENSION', 'CHARGE'], required: true },
  payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payee' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  amount: { type: Number, required: true, min: 0 },
  description: String,
  status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

