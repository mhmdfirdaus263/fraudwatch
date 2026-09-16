# Model Comparison

## Evaluation Strategy

Models were evaluated using a chronological 80/20 split of the training
dataset.

- Training rows: 1,037,340
- Validation rows: 259,335
- Primary metric: PR-AUC
- Secondary metrics: precision, recall, F1 score, and ROC-AUC

PR-AUC is prioritized because the dataset is highly imbalanced and fraud
represents less than one percent of all transactions.

## Historical Model Results

The first model comparison included customer age as an input feature.

| Model | Precision | Recall | F1 | PR-AUC | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Logistic Regression | 0.3331 | 0.6450 | 0.4393 | 0.2304 | 0.9595 |
| Random Forest | 0.7912 | 0.7835 | 0.7873 | 0.8569 | 0.9941 |
| Histogram Gradient Boosting | 0.8877 | 0.7809 | 0.8309 | 0.8927 | 0.9974 |

Each row reports performance at that model's best validation F1 threshold.

Histogram Gradient Boosting was initially selected because it produced the
highest F1 score and PR-AUC while keeping the serialized model relatively
small.

Its historical decision threshold was:

```text
0.9687659320172795