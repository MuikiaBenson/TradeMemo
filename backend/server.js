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
// Connect DB and Start Server
