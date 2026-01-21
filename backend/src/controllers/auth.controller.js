const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');
const UserModel = require('../models/user.model');
const jwtConfig = require('../config/jwt');

/**
 * Authentication Controller
 */
const AuthController = {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(req, res, next) {
        try {
            const { email, password, name, role, phone } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return errorResponse(res, 'Email already registered', 409);
            }

            // Validate role (only ADMIN can create ADMIN or AGENT accounts)
            if ((role === 'ADMIN' || role === 'AGENT') && (!req.user || req.user.role !== 'ADMIN')) {
                return errorResponse(res, 'Unauthorized to create this role', 403);
            }

            // Create user
            const user = await UserModel.create({
                email,
                password,
                name,
                role: role || 'CLIENT',
                phone
            });

            // Generate tokens
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                jwtConfig.jwtSecret,
                { expiresIn: jwtConfig.jwtExpire }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                jwtConfig.jwtRefreshSecret,
                { expiresIn: jwtConfig.jwtRefreshExpire }
            );

            return successResponse(res, {
                user,
                accessToken,
                refreshToken
            }, 'User registered successfully', 201);

        } catch (error) {
            next(error);
        }
    },

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user with password
            const user = await UserModel.findByEmail(email, true);
            if (!user) {
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Verify password
            const isPasswordValid = await UserModel.verifyPassword(password, user.password);
            if (!isPasswordValid) {
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Remove password from user object
            delete user.password;

            // Generate tokens
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                jwtConfig.jwtSecret,
                { expiresIn: jwtConfig.jwtExpire }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                jwtConfig.jwtRefreshSecret,
                { expiresIn: jwtConfig.jwtRefreshExpire }
            );

            return successResponse(res, {
                user,
                accessToken,
                refreshToken
            }, 'Login successful');

        } catch (error) {
            next(error);
        }
    },

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return errorResponse(res, 'Refresh token required', 400);
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, jwtConfig.jwtRefreshSecret);

            // Get user
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return errorResponse(res, 'User not found', 404);
            }

            // Generate new access token
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                jwtConfig.jwtSecret,
                { expiresIn: jwtConfig.jwtExpire }
            );

            return successResponse(res, { accessToken }, 'Token refreshed successfully');

        } catch (error) {
            next(error);
        }
    },

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    async getProfile(req, res, next) {
        try {
            const user = await UserModel.findById(req.user.id);

            if (!user) {
                return errorResponse(res, 'User not found', 404);
            }

            return successResponse(res, user, 'Profile retrieved successfully');

        } catch (error) {
            next(error);
        }
    },

    /**
     * Update user profile
     * PUT /api/auth/profile
     */
    async updateProfile(req, res, next) {
        try {
            const { name, phone } = req.body;

            const updatedUser = await UserModel.updateProfile(req.user.id, { name, phone });

            return successResponse(res, updatedUser, 'Profile updated successfully');

        } catch (error) {
            next(error);
        }
    },

    /**
     * Change password
     * PUT /api/auth/password
     */
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Get user with password
            const user = await UserModel.findByEmail(req.user.email, true);

            // Verify current password
            const isPasswordValid = await UserModel.verifyPassword(currentPassword, user.password);
            if (!isPasswordValid) {
                return errorResponse(res, 'Current password is incorrect', 401);
            }

            // Update password
            await UserModel.updatePassword(req.user.id, newPassword);

            return successResponse(res, null, 'Password changed successfully');

        } catch (error) {
            next(error);
        }
    }
};

module.exports = AuthController;
