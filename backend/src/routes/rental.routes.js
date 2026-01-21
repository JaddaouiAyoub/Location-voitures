const express = require('express');
const router = express.Router();
const RentalController = require('../controllers/rental.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { rentalValidation } = require('../middlewares/validation.middleware');

/**
 * Rental Routes
 */

// All rental routes require authentication
router.use(verifyToken);

// Get user's rental history
router.get('/my/history', RentalController.getMyRentals);

// Create rental (authenticated users)
router.post('/', rentalValidation, RentalController.create);

// Get all rentals (admin sees all, users see their own)
router.get('/', RentalController.getAll);

// Get rental by ID
router.get('/:id', RentalController.getById);

// Update rental status
router.put('/:id/status', RentalController.updateStatus);

module.exports = router;
