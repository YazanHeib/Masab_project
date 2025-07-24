const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  direction: { type: String, enum: ['OUT', 'IN'], required: true },
  category: { type: String, enum: ['SALARY', 'SUPPLIER', 'PENSION', 'CHARGE'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetType' },
  targetType: { type: String, enum: ['Payee', 'Customer'], required: true },
  amount: { type: Number, required: true, min: 0 },
  note: String,
  status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);