const mongoose = require('mongoose');

const orgAccountSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  branchNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('OrgAccount', orgAccountSchema);
