export const overviewSummary = [
  {
    key: "transactions",
    label: "Final Test Transactions",
    value: "555,719",
    description: "Transactions in the final test set",
    tone: "neutral",
  },
  {
    key: "fraud",
    label: "Actual Fraud Cases",
    value: "2,145",
    description: "Fraud cases in the final test set",
    tone: "danger",
  },
  {
    key: "detected",
    label: "Fraud Correctly Detected",
    value: "1,591",
    description: "74.17% test recall",
    tone: "success",
  },
  {
    key: "alerts",
    label: "Test Alert Rate",
    value: "0.382%",
    description: "Share of test transactions flagged",
    tone: "neutral",
  },
] as const;

export const fraudActivity = [
  {
    day: "Mar 28",
    transactions: 430,
    fraud: 96,
  },
  {
    day: "Mar 31",
    transactions: 510,
    fraud: 82,
  },
  {
    day: "Apr 3",
    transactions: 445,
    fraud: 108,
  },
  {
    day: "Apr 6",
    transactions: 580,
    fraud: 92,
  },
  {
    day: "Apr 9",
    transactions: 520,
    fraud: 75,
  },
  {
    day: "Apr 12",
    transactions: 655,
    fraud: 121,
  },
  {
    day: "Apr 15",
    transactions: 610,
    fraud: 104,
  },
  {
    day: "Apr 18",
    transactions: 735,
    fraud: 158,
  },
  {
    day: "Apr 21",
    transactions: 650,
    fraud: 111,
  },
  {
    day: "Apr 24",
    transactions: 760,
    fraud: 144,
  },
  {
    day: "Apr 27",
    transactions: 720,
    fraud: 132,
  },
] as const;

export const categoryRisk = [
  {
    category: "shopping_net",
    risk: 28,
  },
  {
    category: "misc_net",
    risk: 18,
  },
  {
    category: "grocery_pos",
    risk: 12,
  },
  {
    category: "shopping_pos",
    risk: 10,
  },
  {
    category: "gas_transport",
    risk: 8,
  },
] as const;

export const modelPerformance = [
  {
    label: "Precision",
    value: "74.94%",
    description: "Final test result",
  },
  {
    label: "Recall",
    value: "74.17%",
    description: "Final test result",
  },
  {
    label: "F1 Score",
    value: "74.55%",
    description: "Final test result",
  },
  {
    label: "PR-AUC",
    value: "80.02%",
    description: "Final test result",
  },
] as const;