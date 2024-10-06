const express = require('express');
const connectDB = require('./db');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TradeMemo Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

