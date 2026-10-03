const Food = require('../models/Food');

/**
 * Generates a weekly meal plan based on the specified diet type.
 * @param {string} dietType - The type of diet (e.g., 'Balanced', 'Low_Carb', 'Low_Sodium')
 * @returns {Promise<Object>} The generated weekly meal plan
 */
const generateWeeklyPlan = async (dietType) => {
  // Normalize diet_type (trim whitespace; keep original casing for enum match)
  const normalizedDietType = (dietType || '').trim();

  // Query foods directly by meal_type in lowercase (stored lowercase via Mongoose setter)
  // const breakfastFoods = await Food.find({ diet_type: normalizedDietType, meal_type: 'breakfast' });
  // const lunchFoods    = await Food.find({ diet_type: normalizedDietType, meal_type: 'lunch' });
  // const dinnerFoods   = await Food.find({ diet_type: normalizedDietType, meal_type: 'dinner' });
const breakfastFoods = await Food.find({ diet_type: normalizedDietType, meal_type: 'breakfast' });
const lunchFoods    = await Food.find({ diet_type: normalizedDietType, meal_type: 'lunch' });
const dinnerFoods   = await Food.find({ diet_type: normalizedDietType, meal_type: 'dinner' });

  // Ensure there are foods available for all meal types
  if (breakfastFoods.length === 0) throw new Error(`No breakfast options found in DB for diet type: ${dietType}`);
  if (lunchFoods.length === 0) throw new Error(`No lunch options found in DB for diet type: ${dietType}`);
  if (dinnerFoods.length === 0) throw new Error(`No dinner options found in DB for diet type: ${dietType}`);

  // Helper to get a random food, avoiding the one used the previous day if possible
  const getRandomFood = (foodArray, previousFoodName) => {
    let availableFoods = foodArray;
    
    // Attempt to avoid consecutive repeats if we have enough variety
    if (foodArray.length > 1 && previousFoodName) {
      const filtered = foodArray.filter(f => f.food_name !== previousFoodName);
      if (filtered.length > 0) {
        availableFoods = filtered;
      }
    }

    const randomIndex = Math.floor(Math.random() * availableFoods.length);
    return availableFoods[randomIndex];
  };

  const weeklyPlan = {};
  let prevBreakfast = null;
  let prevLunch = null;
  let prevDinner = null;

  // Generate a plan for 7 days
  for (let i = 1; i <= 7; i++) {
    const breakfast = getRandomFood(breakfastFoods, prevBreakfast);
    const lunch = getRandomFood(lunchFoods, prevLunch);
    const dinner = getRandomFood(dinnerFoods, prevDinner);

    // weeklyPlan[`day_${i}`] = {
    //   // breakfast: { food_name: breakfast.food_name, calories: breakfast.calories },
    //   // lunch: { food_name: lunch.food_name, calories: lunch.calories },
    //   // dinner: { food_name: dinner.food_name, calories: dinner.calories }
    // };
    weeklyPlan[`day_${i}`] = {
 breakfast: { food_name: breakfast.food_name, calories: breakfast.calories },
lunch: { food_name: lunch.food_name, calories: lunch.calories },
dinner: { food_name: dinner.food_name, calories: dinner.calories }
};

    // Store the selected meals to prevent consecutive day repeats
   prevBreakfast = breakfast.food_name;
prevLunch = lunch.food_name;
prevDinner = dinner.food_name;
  }

  return weeklyPlan;
};

module.exports = {
  generateWeeklyPlan
};
