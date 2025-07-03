// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
//const blogRoutes = require('./routes/blogRoutes');
app.use('/api/auth', authRoutes);
//app.use('/api/blogs', blogRoutes);

//Root route to respond when visiting http://localhost:5000
app.get('/', (req, res) => {
  res.send('TradeMemo backend is running!');
});

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
