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
