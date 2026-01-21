const express = require('express');
const router = express.Router();
const CarController = require('../controllers/car.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { carValidation } = require('../middlewares/validation.middleware');

/**
 * Car Routes
 */

// Get cars with GPS locations for map (public)
router.get('/map/locations', CarController.getLocations);

// Public routes - anyone can view cars
router.get('/', CarController.getAll);
router.get('/:id', CarController.getById);

// Check availability (authenticated users)
router.post('/:id/check-availability', verifyToken, CarController.checkAvailability);

// Protected routes - ADMIN and AGENT can manage cars
router.post('/', verifyToken, requireRole('ADMIN', 'AGENT'), carValidation, CarController.create);
router.put('/:id', verifyToken, requireRole('ADMIN', 'AGENT'), carValidation, CarController.update);

// Delete - ADMIN only
router.delete('/:id', verifyToken, requireRole('ADMIN'), CarController.delete);

module.exports = router;
