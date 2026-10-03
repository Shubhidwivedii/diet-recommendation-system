const Joi = require('joi');

const schema = Joi.object({
  Age: Joi.number().min(1).max(120).required(),
  Gender: Joi.string().valid('Male', 'Female').required(),
  Weight_kg: Joi.number().min(1).max(300).required(),
  Height_cm: Joi.number().min(50).max(250).required(),
  BMI: Joi.number().min(10).max(60).required(),
  Disease_Type: Joi.string().valid('Diabetes', 'Hypertension', 'None', 'Obesity').default('None'),
  Severity: Joi.string().valid('Mild', 'Moderate', 'Severe').required(),
  Physical_Activity_Level: Joi.string().valid('Active', 'Moderate', 'Sedentary').required(),
  Daily_Caloric_Intake: Joi.number().min(500).max(5000).required(),
  Cholesterol_mgdL: Joi.number().required(),
  Blood_Pressure_mmHg: Joi.number().required(),
  Glucose_mgdL: Joi.number().required(),
  Dietary_Restrictions: Joi.string().valid('Low_Sodium', 'Low_Sugar', 'None').default('None'),
  Allergies: Joi.string().valid('Gluten', 'None', 'Peanuts').default('None'),
  Preferred_Cuisine: Joi.string().valid('Chinese', 'Indian', 'Italian', 'Mexican').required(),
  Weekly_Exercise_Hours: Joi.number().min(0).max(168).required(),
  Adherence_to_Diet_Plan: Joi.number().min(50).max(100).required(),
  Dietary_Nutrient_Imbalance_Score: Joi.number().min(0).max(5).required()
});

const validatePredictRequest = (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: ' +
        error.details.map(d => d.message).join(', ')
    });
  }
  req.body = value;
  next();
};

module.exports = { validatePredictRequest };
