# FraudWatch Model Comparison

## Validation Setup

All models were evaluated using the same chronological validation set:

- Training rows: 1,037,340
- Validation rows: 259,335
- Validation period: 2020-03-06 to 2020-06-21
- Validation fraud cases: 1,538

The external test dataset remained frozen during model selection.

## Results

Each model is shown using its best validation F1 threshold.

| Model | Threshold | Precision | Recall | F1 | PR-AUC | ROC-AUC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Logistic Regression | 0.9003 | 0.3331 | 0.6450 | 0.4393 | 0.2304 | 0.9595 |
| Random Forest | 0.6427 | 0.7912 | 0.7835 | 0.7873 | 0.8569 | 0.9941 |
| Histogram Gradient Boosting | 0.9688 | 0.8877 | 0.7809 | 0.8309 | 0.8927 | 0.9974 |

## Champion Model

Histogram Gradient Boosting was selected as the champion model.

At its selected threshold:

- True negatives: 257,645
- False positives: 152
- False negatives: 337
- True positives: 1,201

Reasons for selection:

- Highest validation F1-score
- Highest precision
- Highest PR-AUC
- Highest ROC-AUC
- Substantially fewer false alerts than Random Forest
- Suitable inference characteristics for a web application

## Locked Decision

The selected validation threshold is:

```text
0.9687659320172795