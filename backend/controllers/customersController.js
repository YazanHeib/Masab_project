const Customer = require('../models/Customer');

exports.getAll = async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
};

exports.create = async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.status(201).json(customer);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Customer.findByIdAndDelete(id);
  res.json({ message: 'Customer deleted' });
};