const express = require('express');
const router = express.Router();

const { validatePredictRequest } = require('../middleware/validate');
const { predictDiet } = require('../controllers/predictionController');
const Prediction = require('../models/Prediction');
const { generateWeeklyPlan } = require('../services/mealPlannerService');

// POST /api/predict
// Uses validation middleware, then controller
router.post('/', validatePredictRequest, predictDiet);

// GET /api/predict/history
// Returns all saved Prediction documents, sorted by created_at descending
router.get('/history', async (req, res, next) => {
  try {
    const history = await Prediction.find().sort({ created_at: -1 });
    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    // Pass to centralized error handler
    next(error);
  }
});

// POST /api/predict/regenerate
// Generates a new meal plan based on the passed diet_type without saving to DB or hitting ML API
router.post('/regenerate', async (req, res, next) => {
  try {
    const { diet_type } = req.body;

    if (!diet_type) {
      return res.status(400).json({
        error: true,
        message: 'diet_type is required in the request body.'
      });
    }

    const weekly_plan = await generateWeeklyPlan(diet_type);

    res.json({
      diet_type,
      weekly_plan
    });
  } catch (error) {
    // Handle case where no foods exist for diet type
    if (error.message.includes('No') && error.message.includes('options found in DB')) {
      return res.status(404).json({
        error: true,
        message: error.message
      });
    }
    
    // Pass to centralized error handler
    next(error);
  }
});

module.exports = router;
