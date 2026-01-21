const { successResponse, errorResponse } = require('../utils/response');
const RentalModel = require('../models/rental.model');

/**
 * Rental Controller
 */
const RentalController = {
    /**
     * Create a new rental
     * POST /api/rentals
     */
    async create(req, res, next) {
        try {
            const { car_id, start_date, end_date } = req.body;

            const rental = await RentalModel.create({
                user_id: req.user.id,
                car_id,
                start_date,
                end_date
            });

            return successResponse(res, rental, 'Rental created successfully', 201);
        } catch (error) {
            if (error.message === 'Car is not available for the selected dates') {
                return errorResponse(res, error.message, 409);
            }
            next(error);
        }
    },

    /**
     * Get all rentals (admin) or user's rentals
     * GET /api/rentals
     */
    async getAll(req, res, next) {
        try {
            const userId = req.user.role === 'ADMIN' ? null : req.user.id;
            const status = req.query.status;

            const rentals = await RentalModel.findAll(userId, status);

            return successResponse(res, rentals, 'Rentals retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get rental by ID
     * GET /api/rentals/:id
     */
    async getById(req, res, next) {
        try {
            const rental = await RentalModel.findById(req.params.id);

            if (!rental) {
                return errorResponse(res, 'Rental not found', 404);
            }

            // Check if user owns this rental (unless admin)
            if (req.user.role !== 'ADMIN' && rental.user_id !== req.user.id) {
                return errorResponse(res, 'Unauthorized access', 403);
            }

            return successResponse(res, rental, 'Rental retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update rental status
     * PUT /api/rentals/:id/status
     */
    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;

            if (!['Active', 'Completed', 'Cancelled'].includes(status)) {
                return errorResponse(res, 'Invalid status', 400);
            }

            const rental = await RentalModel.findById(req.params.id);

            if (!rental) {
                return errorResponse(res, 'Rental not found', 404);
            }

            // Only admin or rental owner can update status
            if (req.user.role !== 'ADMIN' && rental.user_id !== req.user.id) {
                return errorResponse(res, 'Unauthorized access', 403);
            }

            const updatedRental = await RentalModel.updateStatus(req.params.id, status);

            return successResponse(res, updatedRental, 'Rental status updated successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get user's rental history
     * GET /api/rentals/my/history
     */
    async getMyRentals(req, res, next) {
        try {
            const rentals = await RentalModel.findAll(req.user.id);

            return successResponse(res, rentals, 'Rental history retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = RentalController;
