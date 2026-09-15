# FraudWatch Final Test Results

## Evaluation Protocol

The champion model, feature set, and decision threshold were selected using a chronological validation set.

After model selection:

1. Histogram Gradient Boosting was refitted on all training data.
2. The previously locked threshold was retained.
3. The frozen test dataset was evaluated once.
4. No test result was used for further model tuning.

## Final Configuration

- Model: Histogram Gradient Boosting
- Training rows: 1,296,675
- Test rows: 555,719
- Test fraud cases: 2,145
- Locked threshold: 0.9687659320172795

## Final Metrics

| Metric | Result |
| --- | ---: |
| Precision | 0.7974 |
| Recall | 0.7706 |
| F1-score | 0.7838 |
| PR-AUC | 0.8523 |
| ROC-AUC | 0.9967 |
| Predicted alerts | 2,073 |
| Alert rate | 0.3730% |

## Confusion Matrix

|  | Predicted legitimate | Predicted fraud |
| --- | ---: | ---: |
| Actual legitimate | 553,154 | 420 |
| Actual fraud | 492 | 1,653 |

## Interpretation

The final model detected approximately 77.06% of fraudulent transactions. Approximately 79.74% of generated fraud alerts were correct.

The model produced 420 false alerts across 553,574 legitimate transactions.

Validation performance was higher than final test performance. This decrease is expected because the test dataset represents a later period with a different fraud prevalence.

## Batch Inference Performance

The model processed 555,719 transactions in approximately 2.52 seconds, or about 220,732 transactions per second during local batch inference.

This measurement does not represent HTTP request latency and must not be presented as web API performance.

## Limitations

- The dataset is synthetic.
- Real financial fraud patterns may be more complex.
- The model does not use customer transaction history.
- Probabilities have not been calibrated.
- Performance may change under data drift.
- Predictions require human review.