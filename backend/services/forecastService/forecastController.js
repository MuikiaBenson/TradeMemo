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

