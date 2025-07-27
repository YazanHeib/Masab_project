const express = require('express');
const router = express.Router();
const verifyJWT = require('../utils/middleware');
const Payee = require('../models/Payee');

router.use(verifyJWT);

// GET all payees
router.get('/', async (req, res) => {
  try {
    const payees = await Payee.find();
    res.json(payees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one payee
router.get('/getOne/:id', async (req, res) => {
  try {
    const payee = await Payee.findById(req.params.id);
    if (!payee) return res.status(404).json({ message: 'Payee not found' });
    res.json(payee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a payee
router.post('/create', async (req, res) => {
  try {
    const payee = new Payee(req.body);
    const saved = await payee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a payee
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Payee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Payee not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a payee
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Payee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Payee not found' });
    res.json({ message: 'Payee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
