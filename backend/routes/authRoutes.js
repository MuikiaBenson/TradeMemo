// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import auth controller functions
const { register, login } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
router.post('/login', login);

// Export the router to be used in the main app
module.exports = router;

