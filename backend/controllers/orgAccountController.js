const OrgAccount = require('../models/OrgAccount');

exports.getAccount = async (req, res) => {
  const account = await OrgAccount.findOne();
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }
  res.json(account);
};

exports.updateBalance = async (req, res) => {
  const { balance } = req.body;
  const account = await OrgAccount.findOne();
  if (!account) return res.status(404).json({ message: 'Account not found' });
  account.balance = balance;
  await account.save();
  res.json(account);
};