// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();
console.log('[ENV] JWT_SECRET:', process.env.JWT_SECRET); // Debug line

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
const authRoutes = require('./routes/authRoutes');
// const blogRoutes = require('./routes/blogRoutes')

app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes)

// Root route for browser test
app.get('/', (req, res) => {
  res.send('TradeMemo backend is running!');
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err);
});
