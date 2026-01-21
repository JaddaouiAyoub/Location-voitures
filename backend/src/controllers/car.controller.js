const { successResponse, errorResponse } = require('../utils/response');
const CarModel = require('../models/car.model');

/**
 * Car Controller
 */
const CarController = {
    /**
     * Create a new car (ADMIN/AGENT only)
     * POST /api/cars
     */
    async create(req, res, next) {
        try {
            const carData = req.body;
            const car = await CarModel.create(carData);

            return successResponse(res, car, 'Car created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get all cars with filters
     * GET /api/cars
     */
    async getAll(req, res, next) {
        try {
            const filters = {
                brand: req.query.brand,
                status: req.query.status,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                available: req.query.available
            };

            const cars = await CarModel.findAll(filters);

            return successResponse(res, cars, 'Cars retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get car by ID
     * GET /api/cars/:id
     */
    async getById(req, res, next) {
        try {
            const car = await CarModel.findById(req.params.id);

            if (!car) {
                return errorResponse(res, 'Car not found', 404);
            }

            return successResponse(res, car, 'Car retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update car (ADMIN/AGENT only)
     * PUT /api/cars/:id
     */
    async update(req, res, next) {
        try {
            const car = await CarModel.findById(req.params.id);

            if (!car) {
                return errorResponse(res, 'Car not found', 404);
            }

            const updatedCar = await CarModel.update(req.params.id, req.body);

            return successResponse(res, updatedCar, 'Car updated successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Delete car (ADMIN only)
     * DELETE /api/cars/:id
     */
    async delete(req, res, next) {
        try {
            const car = await CarModel.findById(req.params.id);

            if (!car) {
                return errorResponse(res, 'Car not found', 404);
            }

            await CarModel.delete(req.params.id);

            return successResponse(res, null, 'Car deleted successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get cars with GPS locations for map
     * GET /api/cars/map/locations
     */
    async getLocations(req, res, next) {
        try {
            const cars = await CarModel.findWithLocations();

            return successResponse(res, cars, 'Car locations retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Check car availability
     * POST /api/cars/:id/check-availability
     */
    async checkAvailability(req, res, next) {
        try {
            const { start_date, end_date } = req.body;
            const isAvailable = await CarModel.isAvailable(req.params.id, start_date, end_date);

            return successResponse(res, { available: isAvailable },
                isAvailable ? 'Car is available' : 'Car is not available for selected dates');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CarController;
