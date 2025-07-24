const express = require('express');
const { getAccount, updateBalance } = require('../controllers/orgAccountController');

const router = express.Router();

router.get('/', getAccount);
router.put('/', updateBalance);

module.exports = router;