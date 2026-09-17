export const championProfile = {
  name: "Histogram Gradient Boosting",
  description:
    "Gradient boosting decision trees for fraud detection.",
  threshold: "0.9797",
  thresholdDescription: "Classification threshold",
  status: "Ready",
  statusDescription: "Model ready for inference",
} as const;

export const referencePerformanceMetrics = [
  {
    key: "precision",
    label: "Precision",
    value: "74.94%",
  },
  {
    key: "recall",
    label: "Recall",
    value: "74.17%",
  },
  {
    key: "f1-score",
    label: "F1 Score",
    value: "74.55%",
  },
  {
    key: "pr-auc",
    label: "PR-AUC",
    value: "80.02%",
  },
  {
    key: "roc-auc",
    label: "ROC-AUC",
    value: "99.58%",
  },
] as const;

export const modelInsightSummary = [
  {
    key: "f1-score",
    label: "F1 Score",
    value: "74.55%",
    description: "Balance of precision and recall",
    tone: "primary",
  },
  {
    key: "pr-auc",
    label: "PR-AUC",
    value: "80.02%",
    description: "Performance on imbalanced data",
    tone: "success",
  },
  {
    key: "precision",
    label: "Precision",
    value: "74.94%",
    description: "Accuracy of fraud alerts",
    tone: "warning",
  },
  {
    key: "recall",
    label: "Recall",
    value: "74.17%",
    description: "Detected fraud transactions",
    tone: "primary",
  },
] as const;

export const confusionMatrix = [
  {
    key: "true-negative",
    abbreviation: "TN",
    label: "True Negative",
    value: 553_042,
    actual: "Legitimate",
    predicted: "Legitimate",
    tone: "neutral",
  },
  {
    key: "false-positive",
    abbreviation: "FP",
    label: "False Positive",
    value: 532,
    actual: "Legitimate",
    predicted: "Fraud",
    tone: "warning",
  },
  {
    key: "false-negative",
    abbreviation: "FN",
    label: "False Negative",
    value: 554,
    actual: "Fraud",
    predicted: "Legitimate",
    tone: "danger",
  },
  {
    key: "true-positive",
    abbreviation: "TP",
    label: "True Positive",
    value: 1_591,
    actual: "Fraud",
    predicted: "Fraud",
    tone: "success",
  },
] as const;

export const featureImportance = [
  {
    feature: "Transaction amount",
    shortLabel: "Amount",
    importance: 0.8855049228,
  },
  {
    feature: "Transaction category",
    shortLabel: "Category",
    importance: 0.8119272882,
  },
  {
    feature: "Transaction hour",
    shortLabel: "Hour",
    importance: 0.1292048211,
  },
  {
    feature: "City population",
    shortLabel: "Population",
    importance: 0.011735793,
  },
  {
    feature: "Customer–merchant distance",
    shortLabel: "Distance",
    importance: 0.0001442366,
  },
  {
    feature: "Weekday",
    shortLabel: "Weekday",
    importance: 0,
  },
  {
    feature: "State",
    shortLabel: "State",
    importance: 0,
  },
] as const;

export const modelComparison = [
  {
    model: "Logistic Regression",
    shortModel: "Logistic Regression",
    precision: 33.31,
    recall: 64.50,
    f1Score: 43.93,
    prAuc: 23.04,
  },
  {
    model: "Random Forest",
    shortModel: "Random Forest",
    precision: 79.12,
    recall: 78.35,
    f1Score: 78.73,
    prAuc: 85.69,
  },
  {
    model: "Privacy-safe HistGradient",
    shortModel: "HistGradient",
    precision: 83.08,
    recall: 74.38,
    f1Score: 78.49,
    prAuc: 84.60,
  },
] as const;

export const privacyLimitations = [
  {
    key: "privacy",
    title: "Customer age and date of birth removed",
    description:
      "Sensitive personal attributes are excluded from training and evaluation.",
    icon: "lock",
  },
  {
    key: "synthetic",
    title: "Synthetic dataset",
    description:
      "Model developed and evaluated on a synthetic dataset, not live customer data.",
    icon: "database",
  },
  {
    key: "review",
    title: "Human review recommended",
    description:
      "Flagged transactions should be reviewed by trained analysts.",
    icon: "user",
  },
  {
    key: "calibration",
    title: "Scores are not calibrated probabilities",
    description:
      "Model scores indicate relative risk and are not direct probability estimates.",
    icon: "warning",
  },
] as const;

export const operatingProfile = [
  {
    key: "threshold",
    label: "Decision threshold",
    value: "0.9797",
    description: "Selected on the validation split",
  },
  {
    key: "alert-rate",
    label: "Alert rate",
    value: "0.382%",
    description: "2,123 alerts from 555,719 tests",
  },
  {
    key: "inference-speed",
    label: "Inference speed",
    value: "232K tx/s",
    description: "Batch inference throughput",
  },
  {
    key: "inference-time",
    label: "Test inference",
    value: "2.39 s",
    description: "For the complete frozen test set",
  },
] as const;

export const evaluationProfile = {
  modelName: "Histogram Gradient Boosting",
  trainingRows: 1_296_675,
  testRows: 555_719,
  fraudCases: 2_145,
  predictedAlerts: 2_123,
  threshold: 0.9796734656451997,
} as const;

export const responsibleAiDecisions = [
  {
    key: "age-removal",
    title: "Customer age removed",
    description:
      "Age and date of birth are excluded from deployed model inputs following an ablation study.",
    status: "Privacy decision",
  },
  {
    key: "relative-risk",
    title: "Scores represent relative risk",
    description:
      "Model scores are ranking signals and must not be interpreted as calibrated fraud probabilities.",
    status: "Score guidance",
  },
  {
    key: "human-review",
    title: "Human review for high risk",
    description:
      "High-risk predictions support review decisions instead of automatically blocking transactions.",
    status: "Decision policy",
  },
] as const;