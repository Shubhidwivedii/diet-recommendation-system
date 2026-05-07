const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  food_name: {
    type: String,
    required: true
  },
  meal_type: {
    type: String,
    required: true,
    set: (v) => (v ? v.toLowerCase().trim() : v)
  },
  calories: {
    type: Number,
    required: true
  },
  diet_type: {
    type: String,
    required: true,
    set: (v) => (v ? v.trim() : v),
    enum: ["Balanced", "Low_Carb", "Low_Sodium"]
  }
});

module.exports = mongoose.model('Food', foodSchema);
