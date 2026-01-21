const db = require('../config/database');
const CarModel = require('./car.model');

/**
 * Rental Model - Database operations for rentals
 */
const RentalModel = {
    /**
     * Create a new rental
     * @param {Object} rentalData - Rental data
     * @returns {Object} Created rental
     */
    async create(rentalData) {
        const { user_id, car_id, start_date, end_date } = rentalData;

        // Check car availability
        const isAvailable = await CarModel.isAvailable(car_id, start_date, end_date);
        if (!isAvailable) {
            throw new Error('Car is not available for the selected dates');
        }

        // Get car to calculate price
        const car = await CarModel.findById(car_id);
        if (!car) {
            throw new Error('Car not found');
        }

        // Calculate total price
        const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
        const total_price = days * car.price_per_day;

        const query = `
      INSERT INTO rentals (user_id, car_id, start_date, end_date, total_price, status)
      VALUES (?, ?, ?, ?, ?, 'Active')
    `;

        const [result] = await db.execute(query, [user_id, car_id, start_date, end_date, total_price]);

        // Update car status to Rented
        await CarModel.updateStatus(car_id, 'Rented');

        return await this.findById(result.insertId);
    },

    /**
     * Find rental by ID with car and user details
     * @param {Number} id - Rental ID
     * @returns {Object|null} Rental object or null
     */
    async findById(id) {
        const query = `
      SELECT 
        r.*,
        c.brand, c.model, c.year, c.image_url, c.price_per_day,
        u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `;

        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Get all rentals (admin) or user rentals
     * @param {Number} userId - User ID (optional, for filtering)
     * @param {String} status - Status filter (optional)
     * @returns {Array} Array of rentals
     */
    async findAll(userId = null, status = null) {
        let query = `
      SELECT 
        r.*,
        c.brand, c.model, c.year, c.image_url,
        u.name as user_name, u.email as user_email
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (userId) {
            query += ` AND r.user_id = ?`;
            params.push(userId);
        }

        if (status) {
            query += ` AND r.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY r.created_at DESC`;

        const [rows] = await db.execute(query, params);
        return rows;
    },

    /**
     * Update rental status
     * @param {Number} id - Rental ID
     * @param {String} status - New status (Active, Completed, Cancelled)
     */
    async updateStatus(id, status) {
        const rental = await this.findById(id);
        if (!rental) {
            throw new Error('Rental not found');
        }

        const query = `
      UPDATE rentals
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.execute(query, [status, id]);

        // If rental is completed or cancelled, update car status back to Available
        if (status === 'Completed' || status === 'Cancelled') {
            await CarModel.updateStatus(rental.car_id, 'Available');
        }

        return await this.findById(id);
    },

    /**
     * Get rental statistics (for dashboard)
     * @returns {Object} Statistics
     */
    async getStatistics() {
        // Total rentals
        const [totalResult] = await db.execute('SELECT COUNT(*) as total FROM rentals');

        // Active rentals
        const [activeResult] = await db.execute(
            "SELECT COUNT(*) as active FROM rentals WHERE status = 'Active'"
        );

        // Total revenue
        const [revenueResult] = await db.execute(
            "SELECT SUM(total_price) as revenue FROM rentals WHERE status IN ('Active', 'Completed')"
        );

        // Revenue by month (last 6 months)
        const [monthlyRevenue] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total_price) as revenue
      FROM rentals
      WHERE status IN ('Active', 'Completed')
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

        return {
            total: totalResult[0].total,
            active: activeResult[0].active,
            revenue: revenueResult[0].revenue || 0,
            monthlyRevenue
        };
    },

    /**
     * Get recent rentals (for dashboard)
     * @param {Number} limit - Number of rentals to retrieve
     * @returns {Array} Recent rentals
     */
    async getRecent(limit = 10) {
        const query = `
      SELECT 
        r.id, r.start_date, r.end_date, r.total_price, r.status, r.created_at,
        c.brand, c.model,
        u.name as user_name
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT ?
    `;

        const [rows] = await db.execute(query, [limit]);
        return rows;
    }
};

module.exports = RentalModel;
