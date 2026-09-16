# Customer Age Ablation Study

## Objective

This experiment evaluated whether customer age could be removed without
making the fraud detection system ineffective.

Customer age was identified as an influential feature, but it requires the
application to collect date-of-birth information and introduces privacy and
fairness concerns.

## Validation Results

| Metric | Original model | Without age | Difference |
|---|---:|---:|---:|
| Precision | 0.8877 | 0.8308 | -0.0569 |
| Recall | 0.7809 | 0.7438 | -0.0371 |
| F1 score | 0.8309 | 0.7849 | -0.0460 |
| PR-AUC | 0.8927 | 0.8460 | -0.0467 |
| ROC-AUC | 0.9974 | 0.9964 | -0.0010 |

The privacy-safe candidate used a validation-selected best-F1 threshold of:

```text
0.9796734656451997