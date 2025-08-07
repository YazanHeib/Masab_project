const express = require('express');
const OrgAccount = require('../models/OrgAccount');
const verifyJWT = require('../utils/middleware');
const router = express.Router();

router.use(verifyJWT);

// GET org account
router.get('/', async (req, res) => {
  try {
    const orgAccount = await OrgAccount.findOne().sort({ createdAt: -1 }); 
    if (!orgAccount) {
      return res.status(404).json({ error: 'OrgAccount not found' });
    }
    res.json(orgAccount);
  } catch (error) {
    console.error('Error fetching orgAccount:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST deposit amount
router.post('/deposit', async (req, res) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }

    // Find latest org account
    const orgAccount = await OrgAccount.findOne().sort({ createdAt: -1 });
    if (!orgAccount) {
      return res.status(404).json({ error: 'OrgAccount not found' });
    }

    // Update balance
    orgAccount.balance += amount;
    await orgAccount.save();

    res.json({
      message: `Deposit of ${amount} successful`,
      balance: orgAccount.balance,
    });
  } catch (error) {
    console.error('Error processing deposit:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
