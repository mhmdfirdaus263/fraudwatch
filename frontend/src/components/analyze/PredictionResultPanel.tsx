import {
  AlertTriangle,
  Info,
  ScanSearch,
} from "lucide-react";

import type { PredictionResponse } from "../../types/prediction";

interface PredictionResultPanelProps {
  result: PredictionResponse | null;
}

function formatRiskLevel(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)} risk`;
}

function getRiskFactorTitle(factor: string): string {
  const normalizedFactor = factor.toLowerCase();

  if (
    normalizedFactor.includes("time") ||
    normalizedFactor.includes("hour")
  ) {
    return "High-risk time window";
  }

  if (normalizedFactor.includes("category")) {
    return "Elevated-risk category";
  }

  if (normalizedFactor.includes("amount")) {
    return "Unusual transaction amount";
  }

  if (
    normalizedFactor.includes("distance") ||
    normalizedFactor.includes("location")
  ) {
    return "Location anomaly";
  }

  return "Contextual risk signal";
}

export function PredictionResultPanel({
  result,
}: PredictionResultPanelProps) {
  if (!result) {
    return (
      <aside className="prediction-column">
        <section className="risk-assessment-card risk-assessment-card--empty">
          <header className="result-card__header">
            <h2>Risk Assessment</h2>
          </header>

          <div className="risk-assessment-empty">
            <span>
              <ScanSearch aria-hidden="true" size={28} />
            </span>

            <h3>Ready to analyze</h3>

            <p>
              Complete the transaction details or load the example data,
              then run the model to receive a risk assessment.
            </p>
          </div>
        </section>

        <section className="risk-factors-card risk-factors-card--empty">
          <header className="result-card__header">
            <div>
              <h2>Contextual Risk Factors</h2>
              <p>
                Transparent model signals will appear after analysis.
              </p>
            </div>
          </header>

          <div className="risk-factors-empty">
            <Info aria-hidden="true" size={17} />

            <p>
              Model scores represent relative fraud risk and are not
              calibrated probabilities.
            </p>
          </div>
        </section>
      </aside>
    );
  }

  const score = result.fraud_score;
  const scorePercentage = score * 100;
  const isFraud = result.prediction === "fraud";

  return (
    <aside className="prediction-column">
      <section
        className={
          isFraud
            ? "risk-assessment-card risk-assessment-card--fraud"
            : "risk-assessment-card risk-assessment-card--legitimate"
        }
      >
        <header className="result-card__header">
          <h2>Risk Assessment</h2>
        </header>

        <div className="risk-assessment">
          <div className="risk-assessment__gauge">
            <svg
              aria-label={`Model score ${score.toFixed(4)}`}
              role="img"
              viewBox="0 0 120 120"
            >
              <circle
                className="risk-gauge__track"
                cx="60"
                cy="60"
                pathLength="100"
                r="50"
              />

              <circle
                className="risk-gauge__value"
                cx="60"
                cy="60"
                pathLength="100"
                r="50"
                style={{
                  strokeDashoffset: 100 - scorePercentage,
                }}
              />
            </svg>

            <div className="risk-assessment__score">
              <strong>{score.toFixed(4)}</strong>
              <span>Model score</span>
            </div>
          </div>

          <dl className="risk-assessment__details">
            <div>
              <dt>Prediction</dt>
              <dd>
                <span
                  className={
                    isFraud
                      ? "result-value result-value--fraud"
                      : "result-value result-value--legitimate"
                  }
                >
                  {result.prediction.toUpperCase()}
                </span>
              </dd>
            </div>

            <div>
              <dt>Risk level</dt>
              <dd className={`risk-text risk-text--${result.risk_level}`}>
                {formatRiskLevel(result.risk_level)}
              </dd>
            </div>

            <div>
              <dt>Decision threshold</dt>
              <dd>{result.decision_threshold.toFixed(4)}</dd>
            </div>

            <div>
              <dt>Needs review</dt>
              <dd className={result.needs_review ? "review-required" : ""}>
                {result.needs_review ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="risk-factors-card">
        <header className="result-card__header">
          <div>
            <h2>Contextual Risk Factors</h2>
            <p>Top model signals contributing to this prediction.</p>
          </div>
        </header>

        <div className="risk-factor-list">
          {result.risk_factors.length > 0 ? (
            result.risk_factors.map((factor) => (
              <article className="risk-factor-item" key={factor}>
                <span className="risk-factor-item__icon">
                  <AlertTriangle aria-hidden="true" size={22} />
                </span>

                <div>
                  <h3>{getRiskFactorTitle(factor)}</h3>
                  <p>{factor}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="risk-factor-list__clear">
              <p>
                No elevated contextual risk factors were identified.
              </p>
            </div>
          )}
        </div>

        <footer className="risk-factors-card__footer">
          <Info aria-hidden="true" size={17} />

          <p>
            Model scores are not calibrated probabilities. High-risk
            results should support human review rather than automatic
            blocking.
          </p>
        </footer>
      </section>
    </aside>
  );
}