export const transactionCategories = [
  "entertainment",
  "food_dining",
  "gas_transport",
  "grocery_net",
  "grocery_pos",
  "health_fitness",
  "home",
  "kids_pets",
  "misc_net",
  "misc_pos",
  "personal_care",
  "shopping_net",
  "shopping_pos",
  "travel",
] as const;

export type TransactionCategory =
  (typeof transactionCategories)[number];

export type PredictionLabel = "legitimate" | "fraud";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface TransactionRequest {
  transaction_datetime: string;
  category: TransactionCategory;
  amount: number;
  state: string;
  customer_latitude: number;
  customer_longitude: number;
  city_population: number;
  merchant_latitude: number;
  merchant_longitude: number;
}

export interface PredictionResponse {
  prediction: PredictionLabel;
  fraud_score: number;
  decision_threshold: number;
  risk_level: RiskLevel;
  needs_review: boolean;
  risk_factors: string[];
}

export interface AnalysisRecord {
  id: string;
  analyzed_at: string;
  request: TransactionRequest;
  result: PredictionResponse;
}