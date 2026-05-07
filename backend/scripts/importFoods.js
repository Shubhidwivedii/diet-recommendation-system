const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// Need to load .env from the backend root if this script is run from backend/scripts/
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Food = require('../models/Food');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dietDB';

// Path relative to this script: ../../ml-api/data/food_dataset_with_diet_type.csv
const CSV_FILE_PATH = path.join(__dirname, '../../ml-api/data/food_dataset_with_diet_type.csv');

const importData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB (dietDB)');

    const results = [];

    // Parse CSV
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Parsed ${results.length} rows from CSV. Starting import...`);
        let insertedCount = 0;
        let skippedCount = 0;

        for (const row of results) {
          try {
            // Check for duplicate by food_name (CSV column: Food_Name)
            const existingFood = await Food.findOne({ food_name: row.Food_Name?.trim() });

            if (existingFood) {
              skippedCount++;
              continue;
            }

            // Normalize casing before saving
            // CSV columns are PascalCase: Food_Name, Meal_Type, Calories, diet_type
            const foodName = (row.Food_Name || '').trim();
            const mealType = (row.Meal_Type || '').toLowerCase().trim(); // "Breakfast" → "breakfast"
            const dietType = (row.diet_type || '').trim();               // Balanced / Low_Carb / Low_Sodium
            const calories = Number(row.Calories);

            const VALID_DIET_TYPES = ['Balanced', 'Low_Carb', 'Low_Sodium'];
            if (!VALID_DIET_TYPES.includes(dietType)) {
              console.warn(`  [SKIP] Unknown diet_type "${dietType}" for food "${foodName}" — skipping.`);
              skippedCount++;
              continue;
            }

            if (!foodName || !mealType || isNaN(calories)) {
              console.warn(`  [SKIP] Incomplete row — food_name: "${foodName}", meal_type: "${mealType}", calories: ${calories}`);
              skippedCount++;
              continue;
            }

            // Create and insert
            const newFood = new Food({
              food_name: foodName,
              meal_type: mealType,
              calories,
              diet_type: dietType
            });

            await newFood.save();
            insertedCount++;
          } catch (err) {
            console.error(`Error inserting row "${row.Food_Name}":`, err.message);
          }
        }

        console.log('\n--- Import Complete ---');
        console.log(`Total Inserted: ${insertedCount}`);
        console.log(`Total Skipped: ${skippedCount}`);

        // Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
      })
      .on('error', (err) => {
        console.error('Error reading CSV:', err);
        process.exit(1);
      });
  } catch (error) {
    console.error('Connection or Import Error:', error.message);
    process.exit(1);
  }
};

importData();
