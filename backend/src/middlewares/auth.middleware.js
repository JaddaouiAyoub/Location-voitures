const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const jwtConfig = require('../config/jwt');

/**
 * Verify JWT Token Middleware
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Access token required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decoded = jwt.verify(token, jwtConfig.jwtSecret);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid or expired token', 401);
    }
};

/**
 * Check if user has required role(s)
 * @param {Array|String} roles - Required role(s)
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'Authentication required', 401);
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Insufficient permissions', 403);
        }

        next();
    };
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, jwtConfig.jwtSecret);
        req.user = decoded;
    } catch (error) {
        // Token invalid but continue anyway
    }

    next();
};

module.exports = {
    verifyToken,
    requireRole,
    optionalAuth
};
