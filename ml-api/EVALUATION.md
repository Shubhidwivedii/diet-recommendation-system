# Evaluation matrix

## Scope and method

The final classifier is the saved `PGS Layer + MLP (16, 8)` model in
`model/mlp_model.pkl`. The results below were reproduced from the 1,000-row
`data/diet_recommendations_dataset.csv` file using the project's saved
encoders, scaler, PGS weights, and the original stratified 80/20 split
(`random_state=42`). The holdout therefore contains 200 rows.

| Component | Metric | Measured result | Notes |
| --- | --- | ---: | --- |
| Plain MLP (16, 8) baseline | Accuracy | 84.00% | Recorded in the saved `feature_config.json`; the plain-model artifact is not retained, so this value cannot be independently re-scored. |
| PGS + MLP (16, 8) final classifier | Accuracy | 86.50% | 173 correct predictions out of 200 holdout rows. |
| PGS + MLP (16, 8) final classifier | Balanced accuracy | 85.23% | Mean recall across the three diet classes. |
| PGS + MLP (16, 8) final classifier | Macro precision | 86.33% | Equal weight per class. |
| PGS + MLP (16, 8) final classifier | Macro recall | 85.23% | Equal weight per class. |
| PGS + MLP (16, 8) final classifier | Macro F1 | 85.65% | Equal weight per class. |
| PGS + MLP (16, 8) final classifier | Weighted F1 | 86.28% | Weighted by class support. |
| PGS + MLP (16, 8) final classifier | Multiclass log loss | 0.4435 | Uses the saved model's predicted probabilities. Lower is better. |
| Meal-plan generator | Supported-class integrity | Pass | Verified via `/api/predict/regenerate` for Balanced, Low_Carb, and Low_Sodium: all returned 7 days × 3 meals, with no consecutive repeat for a meal slot. |

### Per-class final-model results

| Class | Precision | Recall | F1 | Holdout support |
| --- | ---: | ---: | ---: | ---: |
| Balanced | 88.17% | 96.47% | 92.13% | 85 |
| Low_Carb | 89.80% | 84.62% | 87.13% | 52 |
| Low_Sodium | 81.03% | 74.60% | 77.69% | 63 |

### Confusion matrix

Rows are actual classes and columns are predicted classes.

| Actual \ Predicted | Balanced | Low_Carb | Low_Sodium |
| --- | ---: | ---: | ---: |
| Balanced | 82 | 0 | 3 |
| Low_Carb | 0 | 44 | 8 |
| Low_Sodium | 11 | 5 | 47 |

## Limits

This evaluates classification against the dataset's `Diet_Recommendation`
label only. The repository has no ground-truth clinical outcomes, user
adherence follow-up, nutrition-target labels, or user ratings for meal plans;
clinical benefit, recommendation relevance, and user satisfaction therefore
cannot be calculated from the available data and are intentionally not claimed.
