import {
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { PredictionResultPanel } from "../components/analyze/PredictionResultPanel";
import { TransactionForm } from "../components/analyze/TransactionForm";
import { saveAnalysisRecord } from "../services/analysisHistory";
import { analyzeTransaction } from "../services/predictionApi";
import type {
  PredictionResponse,
  TransactionRequest,
} from "../types/prediction";

import "./analyze.css";

export function AnalyzePage() {
  const [result, setResult] =
    useState<PredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAnalyze(
    transaction: TransactionRequest,
  ): Promise<void> {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const prediction = await analyzeTransaction(transaction);

      setResult(prediction);
      saveAnalysisRecord(transaction, prediction);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while analyzing the transaction.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset(): void {
    setResult(null);
    setErrorMessage(null);
  }

  return (
    <main className="analyze-page">
      <header className="analyze-heading">
        <div>
          <h1>Analyze Transaction</h1>

          <p>
            Evaluate a transaction using the privacy-safe champion
            fraud detection model.
          </p>
        </div>

        <div className="analyze-heading__badges">
          <span>
            <Globe2 aria-hidden="true" size={15} />
            Model coverage: United States
          </span>

          <span>
            <ShieldCheck aria-hidden="true" size={15} />
            Privacy-safe inputs
          </span>
        </div>
      </header>

      <section className="analyze-layout">
        <TransactionForm
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />

        <PredictionResultPanel result={result} />
      </section>
    </main>
  );
}