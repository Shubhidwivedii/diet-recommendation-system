const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Food = require('../models/Food');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dietDB';

mongoose.connect(MONGODB_URI).then(async () => {
  const total = await Food.countDocuments();
  console.log('Total food docs:', total);

  const mealTypes = await Food.distinct('meal_type');
  console.log('Distinct meal_type values:', mealTypes);

  const dietTypes = await Food.distinct('diet_type');
  console.log('Distinct diet_type values:', dietTypes);

  const breakdown = await Food.aggregate([
    { $group: { _id: { diet_type: '$diet_type', meal_type: '$meal_type' }, count: { $sum: 1 } } },
    { $sort: { '_id.diet_type': 1, '_id.meal_type': 1 } }
  ]);

  console.log('\nBreakdown (diet_type | meal_type : count)');
  breakdown.forEach(b => {
    console.log(`  ${b._id.diet_type} | ${b._id.meal_type}: ${b.count}`);
  });

  await mongoose.disconnect();
  console.log('\nDone.');
});
