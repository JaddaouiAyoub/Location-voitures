const db = require('../config/database');

/**
 * Car Model - Database operations for cars
 */
const CarModel = {
    /**
     * Create a new car
     * @param {Object} carData - Car data
     * @returns {Object} Created car
     */
    async create(carData) {
        const { brand, model, year, price_per_day, status = 'Available', image_url} = carData;

        const query = `
      INSERT INTO cars (brand, model, year, price_per_day, status, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.execute(query, [
            brand, model, year, price_per_day, status, image_url
        ]);

        return await this.findById(result.insertId);
    },

    /**
     * Find car by ID
     * @param {Number} id - Car ID
     * @returns {Object|null} Car object or null
     */
    async findById(id) {
        const query = `SELECT * FROM cars WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Get all cars with optional filters
     * @param {Object} filters - Filter options (brand, status, minPrice, maxPrice, available)
     * @returns {Array} Array of cars
     */
    async findAll(filters = {}) {
        let query = `SELECT * FROM cars WHERE 1=1`;
        const params = [];

        // Filter by brand
        if (filters.brand) {
            query += ` AND brand LIKE ?`;
            params.push(`%${filters.brand}%`);
        }

        // Filter by status
        if (filters.status) {
            query += ` AND status = ?`;
            params.push(filters.status);
        }

        // Filter by price range
        if (filters.minPrice) {
            query += ` AND price_per_day >= ?`;
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            query += ` AND price_per_day <= ?`;
            params.push(filters.maxPrice);
        }

        // Filter available cars only
        if (filters.available === 'true' || filters.available === true) {
            query += ` AND status = 'Available'`;
        }

        query += ` ORDER BY created_at DESC`;

        const [rows] = await db.execute(query, params);
        return rows;
    },

    /**
     * Update car
     * @param {Number} id - Car ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated car
     */
    async update(id, updateData) {
        const { brand, model, year, price_per_day, status, image_url, latitude, longitude } = updateData;

        const query = `
      UPDATE cars
      SET brand = ?, model = ?, year = ?, price_per_day = ?, status = ?, 
          image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.execute(query, [
            brand, model, year, price_per_day, status, image_url, id
        ]);

        return await this.findById(id);
    },

    /**
     * Update car status
     * @param {Number} id - Car ID
     * @param {String} status - New status (Available, Rented, Maintenance)
     */
    async updateStatus(id, status) {
        const query = `
      UPDATE cars
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.execute(query, [status, id]);
        return await this.findById(id);
    },

    /**
     * Delete car
     * @param {Number} id - Car ID
     */
    async delete(id) {
        const query = `DELETE FROM cars WHERE id = ?`;
        await db.execute(query, [id]);
    },

    /**
     * Get cars with GPS locations for map display
     * @returns {Array} Array of cars with GPS coordinates
     */
    async findWithLocations() {
        const query = `
      SELECT id, brand, model, year, price_per_day, status, image_url, latitude, longitude
      FROM cars
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY status, brand
    `;

        const [rows] = await db.execute(query);
        return rows;
    },

    /**
     * Check if car is available for rental
     * @param {Number} carId - Car ID
     * @param {String} startDate - Start date
     * @param {String} endDate - End date
     * @returns {Boolean} True if available
     */
    async isAvailable(carId, startDate, endDate) {
        // Check if car exists and is not in Maintenance status
        const car = await this.findById(carId);
        if (!car || car.status === 'Maintenance') {
            return false;
        }

        // Check for overlapping rentals
        // A rental overlaps if: ExistingStart <= NewEnd AND ExistingEnd >= NewStart
        const query = `
      SELECT COUNT(*) as count
      FROM rentals
      WHERE car_id = ?
        AND status IN ('Active', 'Completed') -- Only count confirmed rentals
        AND NOT (status = 'Cancelled')
        AND (start_date <= ? AND end_date >= ?)
    `;

        const [rows] = await db.execute(query, [
            carId, endDate, startDate
        ]);

        return rows[0].count === 0;
    }
};

module.exports = CarModel;
