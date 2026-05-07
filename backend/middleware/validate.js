const Joi = require('joi');

const schema = Joi.object({
  Age: Joi.number().min(1).max(120).required(),
  Gender: Joi.string().valid('Male', 'Female').required(),
  Weight_kg: Joi.number().min(1).max(300).required(),
  Height_cm: Joi.number().min(50).max(250).required(),
  BMI: Joi.number().min(10).max(60).required(),
  Disease_Type: Joi.string().allow(null, '').default('None'),
  Severity: Joi.string().required(),
  Physical_Activity_Level: Joi.string().required(),
  Daily_Caloric_Intake: Joi.number().min(500).max(5000).required(),
  Cholesterol_mgdL: Joi.number().required(),
  Blood_Pressure_mmHg: Joi.number().required(),
  Glucose_mgdL: Joi.number().required(),
  Dietary_Restrictions: Joi.string().allow(null, ''),
  Allergies: Joi.string().allow(null, ''),
  Preferred_Cuisine: Joi.string().required(),
  Weekly_Exercise_Hours: Joi.number().min(0).max(168).required(),
  Adherence_to_Diet_Plan: Joi.number().allow(null),
  Dietary_Nutrient_Imbalance_Score: Joi.number().allow(null)
});

const validatePredictRequest = (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: ' +
        error.details.map(d => d.message).join(', ')
    });
  }
  next();
};

module.exports = { validatePredictRequest };
