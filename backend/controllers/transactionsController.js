const Transaction = require('../models/Transaction');
const OrgAccount = require('../models/OrgAccount');
const Receipt = require('../models/Receipt');
const pdfGenerator = require('../utils/pdfGenerator'); // assume you have PDF util

// List transactions with optional filters
exports.getAll = async (req, res) => {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.direction) filters.direction = req.query.direction;
  if (req.query.startDate || req.query.endDate) {
    filters.createdAt = {};
    if (req.query.startDate) filters.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filters.createdAt.$lte = new Date(req.query.endDate);
  }
  const transactions = await Transaction.find(filters).sort({ createdAt: -1 });
  res.json(transactions);
};

// Create transaction(s)
exports.create = async (req, res) => {
  const { transactions } = req.body; // expecting array of transactions
  const createdTxs = await Transaction.insertMany(transactions);
  res.status(201).json(createdTxs);
};

// Execute a transaction: mark as DONE, adjust balance, generate receipt
exports.execute = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findById(id);
  if (!transaction || transaction.status === 'DONE') {
    return res.status(404).json({ message: 'Transaction not found or already executed' });
  }
  
  const account = await OrgAccount.findOne();

  if (transaction.direction === 'OUT') {
    // Deduct amount
    if (account.balance < transaction.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    account.balance -= transaction.amount;
  } else {
    // Add amount
    account.balance += transaction.amount;
  }
  await account.save();

  transaction.status = 'DONE';
  await transaction.save();

  // Generate PDF receipt
  const pdfData = { transaction, balance: account.balance };
  const pdfPath = await pdfGenerator.generateReceipt(pdfData, transaction._id);

  // Save receipt record
  const Receipt = require('../models/Receipt');
  const receipt = new Receipt({
    transactionId: transaction._id,
    pdfPath,
    issuedAt: new Date(),
  });
  await receipt.save();

  res.json({ message: 'Transaction executed', transaction, receipt });
};
