const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * Dashboard Routes (ADMIN only)
 */

router.get('/stats', verifyToken, requireRole('ADMIN'), DashboardController.getStatistics);

module.exports = router;
