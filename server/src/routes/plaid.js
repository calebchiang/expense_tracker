const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const plaidController = require('../controllers/plaidController');

router.post('/create_link_token', authenticateToken, plaidController.createLinkToken);

module.exports = router;
