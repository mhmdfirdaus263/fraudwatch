export const overviewSummary = [
  {
    key: "transactions",
    label: "Test Transactions",
    value: "555,719",
    description: "Test dataset transactions",
    tone: "neutral",
  },
  {
    key: "fraud",
    label: "Fraud Cases",
    value: "2,145",
    description: "Test dataset fraud cases",
    tone: "danger",
  },
  {
    key: "detected",
    label: "Detected Fraud",
    value: "1,591",
    description: "74.2% detection rate",
    tone: "success",
  },
  {
    key: "alerts",
    label: "Alert Rate",
    value: "0.382%",
    description: "Test dataset alert rate",
    tone: "neutral",
  },
] as const;

export const fraudActivity = [
  { day: "Mar 28", transactions: 430, fraud: 96 },
  { day: "Mar 31", transactions: 510, fraud: 82 },
  { day: "Apr 3", transactions: 445, fraud: 108 },
  { day: "Apr 6", transactions: 580, fraud: 92 },
  { day: "Apr 9", transactions: 520, fraud: 75 },
  { day: "Apr 12", transactions: 655, fraud: 121 },
  { day: "Apr 15", transactions: 610, fraud: 104 },
  { day: "Apr 18", transactions: 735, fraud: 158 },
  { day: "Apr 21", transactions: 650, fraud: 111 },
  { day: "Apr 24", transactions: 760, fraud: 144 },
  { day: "Apr 27", transactions: 720, fraud: 132 },
] as const;

export const categoryRisk = [
  { category: "shopping_net", risk: 28 },
  { category: "misc_net", risk: 18 },
  { category: "grocery_pos", risk: 12 },
  { category: "shopping_pos", risk: 10 },
  { category: "gas_transport", risk: 8 },
] as const;

export const modelPerformance = [
  {
    label: "Precision",
    value: "74.94%",
    description: "Test results",
  },
  {
    label: "Recall",
    value: "74.17%",
    description: "Test results",
  },
  {
    label: "F1 Score",
    value: "74.55%",
    description: "Test results",
  },
  {
    label: "PR-AUC",
    value: "80.02%",
    description: "Test results",
  },
] as const;

export const recentAnalyses = [
  {
    id: "analysis-001",
    analyzedAt: "Apr 27, 10:21",
    amount: "$1,240.00",
    category: "shopping_net",
    score: "0.9975",
    prediction: "Fraud",
    risk: "High",
  },
  {
    id: "analysis-002",
    analyzedAt: "Apr 27, 10:18",
    amount: "$85.20",
    category: "gas_transport",
    score: "0.0821",
    prediction: "Legitimate",
    risk: "Low",
  },
  {
    id: "analysis-003",
    analyzedAt: "Apr 27, 10:16",
    amount: "$600.00",
    category: "grocery_pos",
    score: "0.8743",
    prediction: "Fraud",
    risk: "High",
  },
  {
    id: "analysis-004",
    analyzedAt: "Apr 27, 10:14",
    amount: "$12.50",
    category: "misc_net",
    score: "0.1124",
    prediction: "Legitimate",
    risk: "Low",
  },
  {
    id: "analysis-005",
    analyzedAt: "Apr 27, 10:11",
    amount: "$2,350.00",
    category: "shopping_pos",
    score: "0.9638",
    prediction: "Fraud",
    risk: "High",
  },
] as const;