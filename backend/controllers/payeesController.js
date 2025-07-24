const Payee = require('../models/Payee');

exports.getAll = async (req, res) => {
  const payees = await Payee.find();
  res.json(payees);
};

exports.create = async (req, res) => {
  const payee = new Payee(req.body);
  await payee.save();
  res.status(201).json(payee);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const payee = await Payee.findByIdAndUpdate(id, req.body, { new: true });
  if (!payee) return res.status(404).json({ message: 'Payee not found' });
  res.json(payee);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Payee.findByIdAndDelete(id);
  res.json({ message: 'Payee deleted' });
};