const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for individual properties (like title, media, and description)
const PropertySchema = new Schema({
    title: { type: String, required: true },
    media: { type: String }, // URL for the media (image/video)
    description: { type: String }
});

// Schema for Forecast
const ForecastSchema = new Schema({
    title: { type: String, required: true },
    generalBias: { type: String, enum: ['BULLISH', 'BEARISH', 'INDECISIVE'], required: true },
    conclusion: { type: String, enum: ['TRADING DAY', 'NOT TRADING DAY', 'SIDELINES'], required: true },
    dailyBias: { type: String, enum: ['BULLISH', 'BEARISH', 'INDECISIVE'], required: true },
    date: { type: Date, default: Date.now }, // Auto-generate the current date
    expectation: { type: String, required: true },
    properties: [PropertySchema], // Additional sections with title, media, and description
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Linked to the user creating the forecast
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forecast', ForecastSchema);

