const express = require('express');
const OrgAccount = require('../models/OrgAccount');
const verifyJWT = require('../utils/middleware');
const router = express.Router();

router.use(verifyJWT);

// Create new org account
router.post('/create', async (req, res) => {
  try {
    const org = await OrgAccount.create(req.body);
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all org accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await OrgAccount.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one org account by ID
router.get('/getOne/:id', async (req, res) => {
  try {
    const account = await OrgAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update org account by ID
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await OrgAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Account not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete org account by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await OrgAccount.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
