const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// POST /api/forecasts - Create a new forecast
router.post('/', forecastController.createForecast);

// POST /api/forecasts/:forecastId/properties - Add a property with media upload
router.post('/:forecastId/properties', uploadMiddleware.single('media'), forecastController.addProperty);

// GET /api/forecasts - Get all forecasts for the logged-in user
router.get('/', forecastController.getForecasts);

// GET /api/forecasts/:forecastId - Get a specific forecast
router.get('/:forecastId', forecastController.getForecastById);

// PUT /api/forecasts/:forecastId - Edit a forecast
router.put('/:forecastId', forecastController.editForecast);

// DELETE /api/forecasts/:forecastId - Delete a forecast
router.delete('/:forecastId', forecastController.deleteForecast);

module.exports = router;

