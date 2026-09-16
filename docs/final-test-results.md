# Final Test Results

## Overview

FraudWatch uses a Histogram Gradient Boosting classifier as its final
champion model.

The production model does not use customer date of birth, customer age,
gender, name, card number, street address, occupation, or transaction ID.
Customer age was removed after an ablation study to reduce privacy and
fairness risks.

## Evaluation Protocol

The model was trained on the complete training dataset and evaluated on the
chronologically later test dataset.

- Training rows: 1,296,675
- Test rows: 555,719
- Test fraud cases: 2,145
- Decision threshold: 0.9796734656451997
- Model: Histogram Gradient Boosting

The threshold was selected using the chronological validation split and was
not optimized against the final test labels.

## Final Metrics

| Metric | Result |
|---|---:|
| Precision | 0.7494 |
| Recall | 0.7417 |
| F1 score | 0.7455 |
| PR-AUC | 0.8002 |
| ROC-AUC | 0.9958 |
| Predicted alerts | 2,123 |
| Alert rate | 0.3820% |

## Confusion Matrix

| | Predicted legitimate | Predicted fraud |
|---|---:|---:|
| Actual legitimate | 553,042 | 532 |
| Actual fraud | 554 | 1,591 |

The model detected 1,591 of 2,145 fraudulent transactions while generating
532 false-positive alerts.

## Inference Performance

- Batch inference time: 2.39 seconds
- Throughput: approximately 232,135 transactions per second

This measurement represents local batch inference on the project machine.
It must not be interpreted as HTTP API latency or production infrastructure
capacity.

## Privacy Revision

An earlier model included customer age and achieved an F1 score of 0.7838
on the test dataset. The privacy-safe model achieves an F1 score of 0.7455.

The project accepts this performance reduction because date of birth and age
are sensitive personal attributes and are not essential to the product's
core functionality.

This test dataset had previously been evaluated using the legacy age-based
model. The privacy-safe revision was selected from validation results for
governance reasons, not because of its performance on the test dataset. This
second evaluation is reported transparently and should not be treated as a
completely untouched benchmark.

## Limitations

- The dataset is synthetic and may not represent real financial systems.
- Fraud patterns can change over time because of concept drift.
- Predicted scores are model scores, not calibrated fraud probabilities.
- High-risk predictions should support human review rather than automatically
  blocking transactions.
- Real deployment requires monitoring, security controls, audit logs, and
  periodic model evaluation.