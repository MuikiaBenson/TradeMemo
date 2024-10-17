const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./services/userService/routes/userRoutes');
const blogRoutes = require('./services/blogService/routes/blogRoutes');
const notebookRoutes = require('./services/notebookService/routes/notebookRoutes'); // Import notebook routes
const forecastRoutes = require('./services/forecastService/routes/forecastRoutes'); // Import forecast routes

// Initialize express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable Cross-Origin Resource Sharing

// User microservice routes
app.use('/api/users', userRoutes);

// Blog microservice routes
app.use('/api/blogs', blogRoutes);

// Notebook microservice routes
app.use('/api/notebooks', notebookRoutes); // Add notebook routes

// Forecast microservice routes
app.use('/api/forecasts', forecastRoutes); // Add forecast routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the TradeMemo API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
