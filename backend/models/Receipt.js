const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  pdfPath: String,
  issuedAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Receipt', receiptSchema);