import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  Database,
  ExternalLink,
  Gauge,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Brand } from "../components/layout/Brand";
import "./landing.css";

const projectMetrics = [
  {
    value: "74.55%",
    label: "F1 Score",
    detail: "Final test result",
  },
  {
    value: "80.02%",
    label: "PR-AUC",
    detail: "Final test result",
  },
  {
    value: "232K",
    label: "tx/sec",
    detail: "Batch inference",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Enter transaction",
    description:
      "Provide transaction details without collecting date of birth.",
    icon: Database,
  },
  {
    number: "02",
    title: "AI evaluates risk",
    description:
      "The champion model produces a score and risk classification.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Review transparent signals",
    description:
      "Inspect contextual risk factors before making a decision.",
    icon: ChartNoAxesCombined,
  },
];

const previewRows = [
  {
    amount: "$1,240.00",
    category: "shopping_net",
    score: "0.9975",
    prediction: "Fraud",
  },
  {
    amount: "$85.20",
    category: "gas_transport",
    score: "0.0821",
    prediction: "Legitimate",
  },
  {
    amount: "$600.00",
    category: "grocery_pos",
    score: "0.8743",
    prediction: "Review",
  },
];

export function LandingPage() {
  return (
    <div className="landing page-enter">
      <header className="landing-header">
        <div className="landing-header__inner">
          <Brand />

          <nav
            className="landing-header__navigation"
            aria-label="Landing navigation"
          >
            <a href="#how-it-works">How It Works</a>
            <Link to="/model-insights">Model</Link>
            <a href="#responsible-ai">Responsible AI</a>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
            >
              API Docs
              <ExternalLink size={14} />
            </a>
          </nav>

          <Link className="landing-header__action" to="/overview">
            Open Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
            <div className="hero__background" aria-hidden="true">
                <span className="hero__shape hero__shape--one" />
                <span className="hero__shape hero__shape--two" />
                <span className="hero__shape hero__shape--three" />
            </div>

          <div className="hero__content">
            <div className="hero__eyebrow">
              <ShieldCheck size={18} />
              Privacy-safe fraud detection
            </div>

            <h1>
              Detect suspicious transactions with{" "}
              <span>responsible AI</span>
            </h1>

            <p className="hero__description">
              An end-to-end AI Engineer portfolio project that combines
              machine learning, explainability, privacy-aware feature
              design, FastAPI, and an interactive React experience.
            </p>

            <div className="hero__actions">
              <Link className="button button--primary" to="/overview">
                Open Dashboard
                <ArrowRight size={19} />
              </Link>

              <Link className="button button--secondary" to="/analyze">
                <Search size={19} />
                Try Transaction Analysis
              </Link>
            </div>

            <div className="hero__metrics" id="model">
              {projectMetrics.map((metric) => (
                <div className="hero-metric" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <small>{metric.detail}</small>
                </div>
              ))}
            </div>

            <p className="hero__disclaimer">
              <Database size={15} />
              Evaluated on a synthetic transaction dataset.
            </p>
          </div>

          <div className="product-preview" aria-label="FraudWatch preview">
            <div className="preview-glow preview-glow--one" />
            <div className="preview-glow preview-glow--two" />

            <article className="preview-card preview-score card-enter">
              <div className="preview-card__header">
                <span>Transaction risk</span>
                <Gauge size={19} />
              </div>

              <div className="score-ring">
                <div>
                  <strong>0.9975</strong>
                  <span>Model score</span>
                </div>
              </div>

              <div className="fraud-notice">
                <TriangleAlert size={21} />
                <div>
                  <strong>Likely fraudulent</strong>
                  <span>Critical risk · Review required</span>
                </div>
              </div>
            </article>

            <article className="preview-card preview-history card-enter">
              <div className="preview-card__header">
                <span>Recent analyses</span>
                <Link to="/history">View all</Link>
              </div>

              <div className="preview-table">
                {previewRows.map((row) => (
                  <div className="preview-table__row" key={row.amount}>
                    <div>
                      <strong>{row.amount}</strong>
                      <span>{row.category}</span>
                    </div>

                    <span className="preview-table__score">
                      {row.score}
                    </span>

                    <span
                      className={`preview-badge preview-badge--${row.prediction.toLowerCase()}`}
                    >
                      {row.prediction}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="preview-card preview-chart card-enter">
              <div className="preview-card__header">
                <span>Fraud activity</span>
                <ChartNoAxesCombined size={19} />
              </div>

              <div className="mini-chart" aria-hidden="true">
                {[36, 48, 42, 62, 55, 70, 64, 82, 73, 88, 77, 92].map(
                  (height, index) => (
                    <span
                      key={`${height}-${index}`}
                      style={{ height: `${height}%` }}
                    />
                  ),
                )}
              </div>

              <div className="mini-chart__legend">
                <span>
                  <i className="legend-dot legend-dot--steel" />
                  Total transactions
                </span>
                <span>
                  <i className="legend-dot legend-dot--orange" />
                  Fraud cases
                </span>
              </div>
            </article>

            <article className="preview-card preview-category card-enter">
                <div className="preview-card__header">
                    <span>Top risk categories</span>
                    <Link to="/model-insights">See all</Link>
                </div>

                <div className="category-preview">
                    {[
                        { name: "shopping_net", value: 100 },
                        { name: "misc_net", value: 72 },
                        { name: "grocery_pos", value: 58 },
                        { name: "shopping_pos", value: 42 },
                        { name: "gas_transport", value: 30 },
                    ].map((category, index) => (
                        <div className="category-preview__row" key={category.name}>
                            <span>{category.name}</span>

                            <div className="category-preview__track">
                                <i
                                    className={
                                        index === 0
                                            ? "category-preview__bar category-preview__bar--primary"
                                            : "category-preview__bar"
                                        }
                                        style={{ width: `${category.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
          </div>
        </section>

        <section
          className="workflow"
          id="how-it-works"
          aria-labelledby="workflow-title"
        >
          <div className="section-heading">
            <span>How it works</span>
            <h2 id="workflow-title">
              From transaction details to transparent risk signals
            </h2>
          </div>

          <div className="workflow__grid">
            {workflowSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article className="workflow-card" key={step.number}>
                  <div className="workflow-card__top">
                    <span>{step.number}</span>
                    <Icon size={24} />
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          className="responsible-ai"
          id="responsible-ai"
          aria-labelledby="responsible-title"
        >
          <div>
            <span className="responsible-ai__eyebrow">
              Responsible by design
            </span>
            <h2 id="responsible-title">
              Strong performance with a smaller privacy footprint
            </h2>
          </div>

          <div className="responsible-ai__points">
            <p>
              Customer age and date of birth were removed after an
              ablation study.
            </p>
            <p>
              Scores indicate relative model risk and are not calibrated
              probabilities.
            </p>
            <p>
              High-risk predictions support human review rather than
              automatic blocking.
            </p>
          </div>

          <Link to="/model-insights">
            Explore model insights
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}