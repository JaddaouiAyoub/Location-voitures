const db = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * User Model - Database operations for users
 */
const UserModel = {
    /**
     * Create a new user
     * @param {Object} userData - User data (email, password, name, role, phone)
     * @returns {Object} Created user (without password)
     */
    async create(userData) {
        const { email, password, name, role = 'CLIENT', phone } = userData;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
      INSERT INTO users (email, password, name, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `;

        const [result] = await db.execute(query, [email, hashedPassword, name, role, phone]);

        // Return user without password
        return await this.findById(result.insertId);
    },

    /**
     * Find user by email
     * @param {String} email - User email
     * @param {Boolean} includePassword - Include password in result (default: false)
     * @returns {Object|null} User object or null
     */
    async findByEmail(email, includePassword = false) {
        const fields = includePassword
            ? 'id, email, password, name, role, phone, created_at, updated_at'
            : 'id, email, name, role, phone, created_at, updated_at';

        const query = `SELECT ${fields} FROM users WHERE email = ?`;
        const [rows] = await db.execute(query, [email]);

        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Find user by ID
     * @param {Number} id - User ID
     * @returns {Object|null} User object or null
     */
    async findById(id) {
        const query = `
      SELECT id, email, name, role, phone, created_at, updated_at
      FROM users
      WHERE id = ?
    `;

        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Update user profile
     * @param {Number} id - User ID
     * @param {Object} updateData - Data to update (name, phone)
     * @returns {Object} Updated user
     */
    async updateProfile(id, updateData) {
        const { name, phone } = updateData;

        const query = `
      UPDATE users
      SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.execute(query, [name, phone, id]);
        return await this.findById(id);
    },

    /**
     * Update user password
     * @param {Number} id - User ID
     * @param {String} newPassword - New password
     */
    async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = `
      UPDATE users
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.execute(query, [hashedPassword, id]);
    },

    /**
     * Verify password
     * @param {String} plainPassword - Plain text password
     * @param {String} hashedPassword - Hashed password from database
     * @returns {Boolean} True if password matches
     */
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    /**
     * Get all users (admin only)
     * @returns {Array} Array of users
     */
    async findAll() {
        const query = `
      SELECT id, email, name, role, phone, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    },

    /**
     * Update user role (admin only)
     * @param {Number} id - User ID
     * @param {String} role - New role (ADMIN, AGENT, CLIENT)
     */
    async updateRole(id, role) {
        const query = `
      UPDATE users
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.execute(query, [role, id]);
        return await this.findById(id);
    }
};

module.exports = UserModel;
