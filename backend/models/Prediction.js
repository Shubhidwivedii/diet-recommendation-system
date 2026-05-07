const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  input: {
    type: Object
  },
  diet_type: {
    type: String
  },
  confidence: {
    type: Number
  },
  weekly_plan: {
    type: Object
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
