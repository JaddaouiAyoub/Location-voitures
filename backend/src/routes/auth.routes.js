const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    passwordChangeValidation
} = require('../middlewares/validation.middleware');

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Protected routes
router.get('/me', verifyToken, AuthController.getProfile);
router.put('/profile', verifyToken, profileUpdateValidation, AuthController.updateProfile);
router.put('/password', verifyToken, passwordChangeValidation, AuthController.changePassword);

module.exports = router;
