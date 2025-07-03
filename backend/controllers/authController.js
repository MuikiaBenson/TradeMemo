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
  console.log('[REGISTER] Incoming request:', { name, email });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[REGISTER] User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    console.log('[REGISTER] User registered successfully:', user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name,
        email
      },
      token
    });
  } catch (err) {
    console.error('[REGISTER] Error during registration:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user and get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('[LOGIN] Request received:', { email });

  try {
    const user = await User.findOne({ email }).select('+password');
    console.log('[LOGIN] User found:', !!user);

    if (!user) {
      console.log('[LOGIN] User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('[LOGIN] Password match result:', isMatch);

    if (!isMatch) {
      console.log('[LOGIN] Password did not match for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log('[LOGIN] Token generated for user:', user._id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email
      },
      token
    });
  } catch (err) {
    console.error('[LOGIN] Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
