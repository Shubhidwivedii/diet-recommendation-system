# Diet Recommendation System — Backend

> Node.js + Express + MongoDB + FastAPI ML API Integration

---

## Project Structure

```
diet-recommendation-system/
├── ml-api/                          # Completed — DO NOT TOUCH
│   ├── data/
│   │   └── food_dataset_with_diet_type.csv
│   ├── model/
│   ├── main.py
│   ├── preprocessing.py
│   └── requirements.txt
│
└── backend/
    ├── controllers/
    │   └── predictionController.js
    ├── routes/
    │   └── predictionRoutes.js
    ├── services/
    │   ├── mlService.js
    │   └── mealPlannerService.js
    ├── models/
    │   ├── Food.js
    │   └── Prediction.js
    ├── config/
    │   └── db.js
    ├── middleware/
    │   ├── validate.js
    │   └── errorHandler.js
    ├── scripts/
    │   └── importFoods.js
    ├── app.js
    ├── server.js
    ├── package.json
    └── .env
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database (dietDB) |
| Mongoose | MongoDB ODM |
| Axios | ML API HTTP calls |
| Joi | Request validation |
| csv-parser | CSV import to MongoDB |

---

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dietDB
ML_API_URL=http://127.0.0.1:8000
```

---

## How to Run

### Step 1 — Start MongoDB
```bash
mongod --dbpath="D:\mongodb-data\db"
```

### Step 2 — Start FastAPI ML API
```bash
cd diet-recommendation-system/ml-api
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

Create `.venv` first with an installed Python 3.12 interpreter if it is not
already present.

### Step 3 — Install Backend Dependencies
```bash
cd diet-recommendation-system/backend
npm install
```

### Step 4 — Import CSV into MongoDB (only once)
```bash
node scripts/importFoods.js
```

### Step 5 — Start Backend Server
```bash
npm start
```

Server runs on: `http://localhost:5000`

### Step 6 — Start Frontend
```bash
cd ../frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## API Endpoints

### POST `/api/predict`
Receives user health input, calls ML API, generates 7-day meal plan.

**Request Body:**
```json
{
  "Age": 25,
  "Gender": "Male",
  "Weight_kg": 70,
  "Height_cm": 175,
  "BMI": 22.9,
  "Disease_Type": "None",
  "Severity": "Mild",
  "Physical_Activity_Level": "Moderate",
  "Daily_Caloric_Intake": 2000,
  "Cholesterol_mgdL": 180,
  "Blood_Pressure_mmHg": 120,
  "Glucose_mgdL": 90,
  "Dietary_Restrictions": "None",
  "Allergies": "None",
  "Preferred_Cuisine": "Indian",
  "Weekly_Exercise_Hours": 5,
  "Adherence_to_Diet_Plan": 75,
  "Dietary_Nutrient_Imbalance_Score": 2.5
}
```

**Response:**
```json
{
  "diet_type": "Balanced",
  "confidence": 91.86,
  "weekly_plan": {
    "day_1": {
      "breakfast": { "food_name": "Oats Porridge", "calories": 116 },
      "lunch": { "food_name": "Lauki Sabzi", "calories": 133 },
      "dinner": { "food_name": "Vegetable Clear Soup", "calories": 125 }
    },
    "day_2": { "..." },
    "day_7": { "..." }
  }
}
```

---

### GET `/api/predict/history`
Returns all saved predictions from MongoDB sorted by newest first.

No request body needed.

---

### POST `/api/predict/regenerate`
Regenerates a new meal plan for same diet type without calling ML API again.

**Request Body:**
```json
{
  "diet_type": "Balanced"
}
```

---

## System Flow

```
Frontend (MERN)
     ↓
POST /api/predict
     ↓
validate.js (Joi validation)
     ↓
predictionController.js
     ↓
mlService.js → POST http://127.0.0.1:8000/predict
     ↓
diet_type + confidence returned
     ↓
mealPlannerService.js → Query MongoDB foods collection
     ↓
7-day meal plan generated (random, no consecutive repeats)
     ↓
Saved to predictions collection
     ↓
Final JSON response to Frontend
```

---

## MongoDB Collections

### foods
```json
{
  "food_name": "Oats Porridge",
  "meal_type": "breakfast",
  "calories": 116,
  "diet_type": "Balanced"
}
```

| diet_type | meal_type | Count |
|-----------|-----------|-------|
| Balanced | breakfast | 10 |
| Balanced | lunch | 18 |
| Balanced | dinner | 7 |
| Low_Carb | breakfast | 8 |
| Low_Carb | lunch | 8 |
| Low_Carb | dinner | 9 |
| Low_Sodium | breakfast | 26 |
| Low_Sodium | lunch | 26 |
| Low_Sodium | dinner | 27 |

### predictions
```json
{
  "input": {},
  "diet_type": "Balanced",
  "confidence": 91.86,
  "weekly_plan": {},
  "created_at": "Date"
}
```

---

## Error Handling

| Error | Status | Message |
|-------|--------|---------|
| Validation failure | 400 | Validation failed: ... |
| ML API timeout | 503 | ML API timeout |
| ML API unavailable | 503 | ML API unavailable |
| Empty food dataset | 404 | No options found |
| MongoDB error | 500 | Database connection error |
| Generic error | 500 | Internal server error |

---

## What is Completed

- [x] Express server setup
- [x] MongoDB connection
- [x] Food and Prediction models
- [x] CSV import into MongoDB
- [x] FastAPI ML API integration
- [x] Weekly meal plan generator with randomization
- [x] Joi request validation
- [x] Centralized error handling
- [x] All three API endpoints tested in Postman
- [x] Prediction history saved to MongoDB

---

