const Forecast = require('../models/Forecast');

// Create a new forecast
exports.createForecast = async (req, res) => {
    try {
        const { title, generalBias, conclusion, dailyBias, expectation } = req.body;

        const newForecast = new Forecast({
            title,
            generalBias,
            conclusion,
            dailyBias,
            expectation,
            owner: req.user.id // Assuming req.user contains the authenticated user info
        });

        const savedForecast = await newForecast.save();
        res.status(201).json(savedForecast);
    } catch (err) {
        res.status(500).json({ message: 'Error creating forecast', error: err.message });
    }
};

// Add a property (title, media, description) to the forecast
exports.addProperty = async (req, res) => {
    try {
        const forecast = await Forecast.findById(req.params.forecastId);

        if (!forecast || forecast.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this forecast' });
        }

        const { title, description } = req.body;
        const media = req.file ? `/uploads/${req.file.filename}` : ''; // Handle media file

        const newProperty = { title, description, media };
        forecast.properties.push(newProperty);
        forecast.updatedAt = Date.now();

        const updatedForecast = await forecast.save();
        res.status(201).json(updatedForecast);
    } catch (err) {
        res.status(500).json({ message: 'Error adding property', error: err.message });
    }
};

// Get all forecasts for a user
exports.getForecasts = async (req, res) => {
    try {
        const forecasts = await Forecast.find({ owner: req.user.id }).populate('properties');
        res.status(200).json(forecasts);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving forecasts', error: err.message });
    }
};

// Get a specific forecast
exports.getForecastById = async (req, res) => {
    try {
        const forecast = await Forecast.findById(req.params.forecastId);

        if (!forecast || forecast.owner.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Forecast not found' });
        }

        res.status(200).json(forecast);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving forecast', error: err.message });
    }
};

// Edit a forecast
exports.editForecast = async (req, res) => {
    try {
        const { title, generalBias, conclusion, dailyBias, expectation } = req.body;
        const forecast = await Forecast.findById(req.params.forecastId);

        if (!forecast || forecast.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to edit this forecast' });
        }

        forecast.title = title || forecast.title;
        forecast.generalBias = generalBias || forecast.generalBias;
        forecast.conclusion = conclusion || forecast.conclusion;
        forecast.dailyBias = dailyBias || forecast.dailyBias;
        forecast.expectation = expectation || forecast.expectation;
        forecast.updatedAt = Date.now();

        const updatedForecast = await forecast.save();
        res.status(200).json(updatedForecast);
    } catch (err) {
        res.status(500).json({ message: 'Error editing forecast', error: err.message });
    }
};

// Delete a forecast
exports.deleteForecast = async (req, res) => {
    try {
        const forecast = await Forecast.findById(req.params.forecastId);

        if (!forecast || forecast.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this forecast' });
        }

        await forecast.remove();
        res.status(200).json({ message: 'Forecast deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting forecast', error: err.message });
    }
};
