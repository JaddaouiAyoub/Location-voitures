const { successResponse } = require('../utils/response');
const DashboardService = require('../services/dashboard.service');

/**
 * Dashboard Controller
 */
const DashboardController = {
    /**
     * Get dashboard statistics (ADMIN only)
     * GET /api/dashboard/stats
     */
    async getStatistics(req, res, next) {
        try {
            const stats = await DashboardService.getStatistics();

            return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = DashboardController;
