const express = require('express');
const { getAll, create, execute } = require('../controllers/transactionsController');

const router = express.Router();

router.get('/', getAll);
router.post('/', create);
router.post('/:id/execute', execute);

module.exports = router;