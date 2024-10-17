const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get user profile (protected route)
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;

