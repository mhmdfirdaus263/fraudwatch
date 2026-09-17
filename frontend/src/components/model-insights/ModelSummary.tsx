import {
  CheckCircle2,
  Layers3,
} from "lucide-react";

import {
  championProfile,
  referencePerformanceMetrics,
} from "../../data/modelInsights";

export function ModelSummary() {
  return (
    <section className="model-profile">
      <div className="model-profile__overview">
        <div className="model-profile__identity">
          <span className="model-profile__icon">
            <Layers3 aria-hidden="true" size={20} />
          </span>

          <div>
            <span>Model</span>
            <strong>{championProfile.name}</strong>
            <small>{championProfile.description}</small>
          </div>
        </div>

        <div className="model-profile__threshold">
          <span>Threshold</span>
          <strong>{championProfile.threshold}</strong>
          <small>{championProfile.thresholdDescription}</small>
        </div>

        <div className="model-profile__status">
          <span>Model Status</span>

          <strong>
            <CheckCircle2 aria-hidden="true" size={14} />
            {championProfile.status}
          </strong>

          <small>{championProfile.statusDescription}</small>
        </div>
      </div>

      <div className="model-profile__metrics">
        {referencePerformanceMetrics.map((metric) => (
          <article key={metric.key}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}