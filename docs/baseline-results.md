# FraudWatch Baseline Results

## Model

The initial baseline uses:

- Logistic Regression
- Balanced class weights
- One-hot encoding for categorical features
- Standard scaling for numerical features
- Chronological train-validation split

Training rows: 1,037,340

Validation rows: 259,335

Validation period:

- 2020-03-06 07:16:43
- 2020-06-21 12:13:37

## Baseline Performance

At the default threshold of `0.5`:

| Metric | Result |
| --- | ---: |
| Precision | 0.0537 |
| Recall | 0.8589 |
| F1-score | 0.1010 |
| PR-AUC | 0.2304 |
| ROC-AUC | 0.9595 |
| Predicted alerts | 24,620 |
| Alert rate | 9.49% |

Confusion matrix:

|  | Predicted legitimate | Predicted fraud |
| --- | ---: | ---: |
| Actual legitimate | 234,498 | 23,299 |
| Actual fraud | 217 | 1,321 |

The default threshold captures most fraud cases but generates too many false alerts.

## Threshold Analysis

| Strategy | Threshold | Precision | Recall | F1 | Alerts |
| --- | ---: | ---: | ---: | ---: | ---: |
| Default | 0.5000 | 0.0537 | 0.8589 | 0.1010 | 24,620 |
| Recall 80% | 0.6298 | 0.1180 | 0.8004 | 0.2057 | 10,431 |
| Recall 70% | 0.8084 | 0.2539 | 0.7003 | 0.3727 | 4,241 |
| Best F1 | 0.9003 | 0.3331 | 0.6450 | 0.4393 | 2,978 |

## Provisional Decision

The baseline will use two provisional operational thresholds:

- Manual review threshold: `0.6298`
- High-risk fraud threshold: `0.9003`

Transactions above the manual review threshold enter the analyst review queue. Transactions above the high-risk threshold receive the highest priority.

These thresholds are provisional and must not be finalized until competing models are evaluated on the same validation period.

## Limitations

- The dataset is synthetic.
- The baseline does not include historical customer behavior.
- Fraud probabilities are not calibrated.
- Class weighting produces aggressive fraud scores.
- Final test data has not been evaluated.