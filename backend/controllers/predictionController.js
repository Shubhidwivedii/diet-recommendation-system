const { predictDiet: callMlApi } = require('../services/mlService');
const { generateWeeklyPlan } = require('../services/mealPlannerService');
const Prediction = require('../models/Prediction');

/**
 * Controller to handle diet prediction and meal plan generation.
 */
const predictDiet = async (req, res, next) => {
  try {
    const userInput = req.body;

    // 1 & 2. Call ML API
    // Let errors bubble up to centralized error handler
    const mlResult = await callMlApi(userInput);
    const { diet_type, confidence } = mlResult;

    // 3. Generate Weekly Meal Plan
    let weekly_plan;
    try {
      weekly_plan = await generateWeeklyPlan(diet_type);
    } catch (error) {
      // Empty Food Dataset Failure
      // Our mealPlannerService throws specific error strings if no foods are found
      if (error.message.includes('No') && error.message.includes('options found in DB')) {
        return res.status(404).json({
          error: true,
          message: error.message
        });
      }
      throw error; // Re-throw to be caught by the generic catch block
    }

    // 4. Save to Prediction Model
    const newPrediction = new Prediction({
      input: userInput,
      diet_type,
      confidence,
      weekly_plan
    });
    await newPrediction.save();

    // 5. Return JSON Result
    return res.json({
      diet_type,
      confidence,
      weekly_plan
    });

  } catch (error) {
    // Pass errors (like ML API timeouts) to the centralized errorHandler
    next(error);
  }
};

module.exports = {
  predictDiet
};
