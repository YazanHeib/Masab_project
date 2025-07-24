const express = require('express');
const { getAll, create, update, delete } = require('../controllers/customersController');

const router = express.Router();

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', delete);

module.exports = router;