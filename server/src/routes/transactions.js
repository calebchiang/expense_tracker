const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const transactionController = require('../controllers/transactionController');

router.get('/fetch_transactions', authenticateToken, transactionController.fetchTransactionData);

module.exports = router;