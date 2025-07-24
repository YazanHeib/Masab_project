const express = require('express');
const { getReceiptStream } = require('../controllers/receiptsController');

const router = express.Router();

router.get('/:id', getReceiptStream);

module.exports = router;