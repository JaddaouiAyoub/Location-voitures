const { errorResponse } = require('../utils/response');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return errorResponse(res, 'Validation Error', 400, err.errors);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
    }

    // Handle MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 'Duplicate entry. Resource already exists.', 409);
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return errorResponse(res, 'Referenced resource not found', 404);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return errorResponse(res, message, statusCode);
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
    return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
    errorHandler,
    notFoundHandler
};
