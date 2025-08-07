const express = require('express');
const OrgAccount = require('../models/OrgAccount');
const verifyJWT = require('../utils/middleware');
const router = express.Router();

router.use(verifyJWT);

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

module.exports = router;
