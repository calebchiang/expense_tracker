const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const transactionController = require('../controllers/transactionController');

router.get('/fetch_raw_transactions' , authenticateToken, transactionController.fetchRawTransactionData);

router.get('/fetch_monthly_transactions', authenticateToken, transactionController.fetchMonthlyTransactionData);

router.get('/fetch_yearly_transactions', authenticateToken, transactionController.fetchYearlyTransactionData);

module.exports = router;