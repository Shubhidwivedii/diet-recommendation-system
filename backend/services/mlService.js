const axios = require('axios');

const ML_API_BASE = process.env.ML_API_URL || 'http://127.0.0.1:8000';
const ML_ENDPOINT = `${ML_API_BASE}/predict`;

/**
 * Calls the FastAPI ML API to predict diet type.
 * @param {Object} userInput - User health input data
 * @param {number} retries - Number of retry attempts on failure (default: 2)
 * @returns {Promise<{ diet_type: string, confidence: number, all_probabilities: Object }>}
 */
const predictDiet = async (userInput, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(ML_ENDPOINT, userInput, {
        timeout: 10000 // 10 seconds timeout
      });

      const { diet_type, confidence, all_probabilities } = response.data;

      return {
        diet_type,
        confidence,
        all_probabilities
      };
    } catch (error) {
      if (attempt === retries) {
        // Throw the original Axios error so the centralized errorHandler can process it
        throw error;
      }
      
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

module.exports = {
  predictDiet
};
