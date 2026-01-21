const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/invoice.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * Invoice Routes
 */

// Download invoice (authenticated users only)
router.get('/:rentalId', verifyToken, InvoiceController.downloadInvoice);

module.exports = router;
