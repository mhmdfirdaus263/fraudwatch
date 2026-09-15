# FraudWatch Dataset Audit

## Dataset

FraudWatch uses the Sparkov simulated credit card transaction dataset.

Files:

- `fraudTrain.csv`
- `fraudTest.csv`

Raw datasets are stored locally in `data/raw/` and are excluded from Git.

## Dataset Size

| Split | Rows | Fraud | Fraud Rate |
| --- | ---: | ---: | ---: |
| Train | 1,296,675 | 7,506 | 0.5789% |
| Test | 555,719 | 2,145 | 0.3860% |
| Total | 1,852,394 | 9,651 | 0.5210% |

Each dataset contains 23 columns and no missing values.

## Temporal Split

Training period:

- 2019-01-01 00:00:18
- 2020-06-21 12:13:37

Test period:

- 2020-06-21 12:14:25
- 2020-12-31 23:59:34

The provided test data occurs chronologically after the training data. It will remain frozen until final model evaluation.

## Integrity Results

- Duplicate train transaction IDs: 0
- Duplicate test transaction IDs: 0
- Transaction ID overlap: 0
- Customer overlap: 908
- Train-only customers: 75
- Test-only customers: 16
- Merchant overlap: 693
- Train-only merchants: 0
- Test-only merchants: 0

## Initial Fraud Patterns

Highest fraud-rate categories:

1. `shopping_net`: 1.7561%
2. `misc_net`: 1.4458%
3. `grocery_pos`: 1.4098%

Highest fraud-rate hours:

1. 22:00: 2.8829%
2. 23:00: 2.8374%
3. 01:00: 1.5349%
4. 00:00: 1.4940%
5. 02:00: 1.4652%
6. 03:00: 1.4239%

Transaction amount:

| Target | Mean | Median | Maximum |
| --- | ---: | ---: | ---: |
| Legitimate | 67.67 | 47.28 | 28,948.90 |
| Fraud | 531.32 | 396.50 | 1,376.04 |

## Modeling Decisions

- Accuracy will not be used as the primary metric.
- Primary metrics will include recall, precision, F1-score, and PR-AUC.
- Validation will use a chronological split.
- Resampling must only be applied to training data.
- The final test dataset must not be used for model selection.
- Personally identifiable information will not be used as direct model input.
- Gender will be excluded because it is a sensitive attribute.
- Predictions will support human review rather than automatic transaction blocking.