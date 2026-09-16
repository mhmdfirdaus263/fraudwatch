import {
  Activity,
  ArrowRight,
  Database,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  categoryRisk,
  fraudActivity,
  modelPerformance,
  overviewSummary,
  recentAnalyses,
} from "../data/overview";

import "./overview.css";

const summaryIcons = {
  transactions: Database,
  fraud: TriangleAlert,
  detected: ShieldCheck,
  alerts: Activity,
};

export function OverviewPage() {
  return (
    <main className="overview-page">
      <header className="overview-heading">
        <div>
          <div className="overview-title-row">
            <h1>Detection Overview</h1>

            <span className="overview-evaluation-badge">
              <ShieldCheck aria-hidden="true" size={13} />
              Final Test Evaluation
            </span>
          </div>

          <p>Final test evaluation and recent browser analyses.</p>
        </div>
      </header>

      <section
        aria-label="Evaluation summary"
        className="overview-summary-grid"
      >
        {overviewSummary.map((item) => {
          const Icon = summaryIcons[item.key];

          return (
            <article
              className={`summary-card summary-card--${item.tone}`}
              key={item.key}
            >
              <span className="summary-card__icon">
                <Icon aria-hidden="true" size={18} />
              </span>

              <div className="summary-card__content">
                <span className="summary-card__label">{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.description}</small>
              </div>

              <div aria-hidden="true" className="summary-card__bars">
                <span />
                <span />
                <span />
                <span />
              </div>
            </article>
          );
        })}
      </section>

      <section className="overview-dashboard-grid">
        <article className="dashboard-panel activity-panel">
          <header className="dashboard-panel__header">
            <div>
              <h2>Fraud Activity</h2>
              <span>Last 30 days</span>
            </div>

            <select
              aria-label="Fraud activity period"
              defaultValue="30-days"
            >
              <option value="30-days">Last 30 days</option>
              <option value="14-days">Last 14 days</option>
              <option value="7-days">Last 7 days</option>
            </select>
          </header>

          <div className="activity-chart">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart
                data={fraudActivity}
                margin={{
                  top: 12,
                  right: 14,
                  bottom: 0,
                  left: -16,
                }}
              >
                <CartesianGrid
                  stroke="#d9e3e8"
                  strokeDasharray="0"
                  vertical
                />

                <XAxis
                  axisLine={false}
                  dataKey="day"
                  fontSize={10}
                  interval={1}
                  stroke="#738999"
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  fontSize={10}
                  stroke="#738999"
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    border: "1px solid #d4dde2",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(13, 27, 49, 0.1)",
                    fontSize: "12px",
                  }}
                />

                <Legend
                  align="right"
                  iconSize={9}
                  verticalAlign="top"
                  wrapperStyle={{
                    fontSize: "10px",
                    paddingBottom: "8px",
                  }}
                />

                <Line
                  dataKey="fraud"
                  dot={{
                    fill: "#fd7b41",
                    r: 2.5,
                    strokeWidth: 0,
                  }}
                  name="Fraud Cases"
                  stroke="#fd7b41"
                  strokeWidth={2}
                  type="monotone"
                />

                <Line
                  dataKey="transactions"
                  dot={{
                    fill: "#315f78",
                    r: 2.5,
                    strokeWidth: 0,
                  }}
                  name="Total Transactions"
                  stroke="#315f78"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="dashboard-panel category-panel">
          <header className="dashboard-panel__header">
            <div>
              <h2>Category Risk</h2>
            </div>
          </header>

          <div className="category-risk-list">
            {categoryRisk.map((item, index) => (
              <div className="category-risk-item" key={item.category}>
                <span className="category-risk-item__name">
                  {item.category}
                </span>

                <div className="category-risk-item__track">
                  <span
                    className={
                      index === 0
                        ? "category-risk-item__bar category-risk-item__bar--primary"
                        : "category-risk-item__bar"
                    }
                    style={{ width: `${item.risk * 3}%` }}
                  />
                </div>

                <strong>{item.risk}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel performance-panel">
          <header className="dashboard-panel__header">
            <div>
              <h2>Model Performance</h2>
            </div>
          </header>

          <div className="performance-grid">
            {modelPerformance.map((metric) => (
              <div className="performance-metric" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.description}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-panel recent-panel">
        <header className="dashboard-panel__header recent-panel__header">
          <div>
            <h2>Recent Analyses</h2>
            <span>Demo browser activity</span>
          </div>

          <Link to="/history">
            View history
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </header>

        <div className="recent-table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Analyzed at</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Score</th>
                <th>Prediction</th>
                <th>Risk</th>
              </tr>
            </thead>

            <tbody>
              {recentAnalyses.map((analysis) => (
                <tr key={analysis.id}>
                  <td>{analysis.analyzedAt}</td>
                  <td>{analysis.amount}</td>
                  <td>{analysis.category}</td>
                  <td>{analysis.score}</td>
                  <td>
                    <span
                      className={
                        analysis.prediction === "Fraud"
                          ? "table-badge table-badge--fraud"
                          : "table-badge table-badge--legitimate"
                      }
                    >
                      {analysis.prediction}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        analysis.risk === "High"
                          ? "table-badge table-badge--high"
                          : "table-badge table-badge--low"
                      }
                    >
                      {analysis.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}