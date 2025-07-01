// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token with a 7-day expiration
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create and save new user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT for the new user
    const token = generateToken(user._id);

    // Return user data (excluding password) and token
    res.status(201).json({
      user: {
        id: user._id,
        name,
        email
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user and get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT on successful login
    const token = generateToken(user._id);

    // Return user info and token
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

