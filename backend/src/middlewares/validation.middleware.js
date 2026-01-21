const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

/**
 * Validation Middleware
 */

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    next();
};

/**
 * Registration validation rules
 */
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number required'),
    body('role')
        .optional()
        .isIn(['ADMIN', 'AGENT', 'CLIENT'])
        .withMessage('Invalid role'),
    handleValidationErrors
];

/**
 * Login validation rules
 */
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

/**
 * Profile update validation
 */
const profileUpdateValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number required'),
    handleValidationErrors
];

/**
 * Password change validation
 */
const passwordChangeValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters'),
    handleValidationErrors
];

/**
 * Car validation rules
 */
const carValidation = [
    body('brand')
        .trim()
        .notEmpty()
        .withMessage('Brand is required'),
    body('model')
        .trim()
        .notEmpty()
        .withMessage('Model is required'),
    body('year')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Valid year is required'),
    body('price_per_day')
        .isFloat({ min: 0 })
        .withMessage('Valid price per day is required'),
    body('status')
        .optional()
        .isIn(['Available', 'Rented', 'Maintenance'])
        .withMessage('Invalid status'),
    body('image_url')
        .optional()
        .isURL()
        .withMessage('Valid image URL required'),
    body('latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Valid latitude required'),
    body('longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Valid longitude required'),
    handleValidationErrors
];

/**
 * Rental validation rules
 */
const rentalValidation = [
    body('car_id')
        .isInt()
        .withMessage('Valid car ID is required'),
    body('start_date')
        .isISO8601()
        .withMessage('Valid start date is required'),
    body('end_date')
        .isISO8601()
        .withMessage('Valid end date is required')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.start_date)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    handleValidationErrors
];

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    passwordChangeValidation,
    carValidation,
    rentalValidation,
    handleValidationErrors
};
