# FraudWatch Global Feature Importance

## Method

Global feature importance was calculated using permutation importance on a stratified sample of 50,000 chronological validation transactions.

The evaluation used average precision, or PR-AUC, as its scoring metric. Each feature was shuffled five times.

The frozen test dataset was not used.

## Results

| Feature | Mean importance | Standard deviation |
| --- | ---: | ---: |
| Amount | 0.885505 | 0.000549 |
| Category | 0.811927 | 0.005839 |
| Hour cosine | 0.129205 | 0.008978 |
| Hour sine | 0.129004 | 0.008363 |
| Customer age | 0.089140 | 0.007679 |
| City population | 0.011736 | 0.001823 |
| Distance | 0.000144 | 0.000379 |
| Log amount | 0.000000 | 0.000000 |
| Weekday sine | -0.000191 | 0.000286 |
| Weekday cosine | -0.001692 | 0.000772 |
| State | -0.007711 | 0.003815 |

## Interpretation

Transaction amount and category are the strongest global predictors. Transaction hour also contributes meaningful predictive information.

Log amount provides no additional measurable value because it is strongly correlated with the original amount feature.

State and weekday features provide little or negative permutation importance. They may add noise rather than useful predictive information.

Permutation importance values are score reductions, not percentages. Correlated features may divide or hide each other's measured importance.

## Responsible AI Concern

Customer age has measurable importance, but age can introduce fairness and discrimination risks. Date of birth is also unnecessary personal information for the web application if the model can perform well without it.

Before production integration, a privacy-preserving model without customer age must be evaluated on the existing validation set.

The frozen test dataset must not be used to decide whether age is removed.

## API Risk Factors

The human-readable API risk factors currently use the three strongest non-sensitive patterns:

- Transaction amount
- Transaction category
- Transaction time

These indicators are contextual explanations based on training-data analysis. They are not exact local feature attributions.