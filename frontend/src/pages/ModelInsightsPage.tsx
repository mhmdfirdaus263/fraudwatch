import {
  LockKeyhole,
  Star,
} from "lucide-react";

import { ConfusionMatrixPanel } from "../components/model-insights/ConfusionMatrixPanel";
import { FeatureImportancePanel } from "../components/model-insights/FeatureImportancePanel";
import { ModelComparisonPanel } from "../components/model-insights/ModelComparisonPanel";
import { ModelSummary } from "../components/model-insights/ModelSummary";
import { PrivacyLimitationsPanel } from "../components/model-insights/PrivacyLimitationsPanel";

import "./model-insights.css";

export function ModelInsightsPage() {
  return (
    <main className="model-insights-page">
      <div className="model-insights-shell">
        <header className="model-insights-heading">
          <div>
            <h1>Model Insights</h1>

            <p>
              Evaluation, explainability, and responsible AI decisions.
            </p>
          </div>

          <div className="model-insights-heading__badges">
            <span className="model-badge model-badge--champion">
              <Star aria-hidden="true" size={14} />
              Champion Model
            </span>

            <span className="model-badge model-badge--privacy">
              <LockKeyhole aria-hidden="true" size={14} />
              Privacy-safe
            </span>
          </div>
        </header>

        <ModelSummary />

        <section className="model-insights-analysis-grid">
          <ConfusionMatrixPanel />
          <FeatureImportancePanel />
        </section>

        <section className="model-insights-bottom-grid">
          <ModelComparisonPanel />
          <PrivacyLimitationsPanel />
        </section>
      </div>
    </main>
  );
}