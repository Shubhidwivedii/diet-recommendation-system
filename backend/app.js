require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const predictionRoutes = require('./routes/predictionRoutes');

// Mount /api/predict route
app.use('/api/predict', predictionRoutes);

// Centralized error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
