const RentalModel = require('../models/rental.model');
const CarModel = require('../models/car.model');

/**
 * Dashboard Service - Statistics and Analytics
 */
const DashboardService = {
    /**
     * Get admin dashboard statistics
     * @returns {Object} Dashboard data
     */
    async getStatistics() {
        // Get car statistics
        const allCars = await CarModel.findAll();
        const totalCars = allCars.length;
        const availableCars = allCars.filter(car => car.status === 'Available').length;
        const rentedCars = allCars.filter(car => car.status === 'Rented').length;
        const maintenanceCars = allCars.filter(car => car.status === 'Maintenance').length;

        // Get rental statistics
        const rentalStats = await RentalModel.getStatistics();

        // Get recent rentals
        const recentRentals = await RentalModel.getRecent(10);

        // Car status distribution
        const carStatusDistribution = {
            Available: availableCars,
            Rented: rentedCars,
            Maintenance: maintenanceCars
        };

        return {
            cars: {
                total: totalCars,
                available: availableCars,
                rented: rentedCars,
                maintenance: maintenanceCars,
                statusDistribution: carStatusDistribution
            },
            rentals: {
                total: rentalStats.total,
                active: rentalStats.active,
                revenue: rentalStats.revenue,
                monthlyRevenue: rentalStats.monthlyRevenue
            },
            recentActivity: recentRentals
        };
    }
};

module.exports = DashboardService;
