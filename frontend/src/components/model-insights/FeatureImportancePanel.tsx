import {
  BarChart3,
  Info,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { featureImportance } from "../../data/modelInsights";

export function FeatureImportancePanel() {
  return (
    <article className="insight-panel feature-panel">
      <header className="insight-panel__header">
        <div>
          <span className="insight-panel__eyebrow">
            Model explainability
          </span>

          <h2>Permutation feature importance</h2>
        </div>

        <span className="insight-panel__icon-badge">
          <BarChart3 aria-hidden="true" size={17} />
        </span>
      </header>

      <p className="feature-panel__description">
        Relative influence on average precision across a representative
        50,000-row sample.
      </p>

      <div className="feature-panel__chart">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={featureImportance}
            layout="vertical"
            margin={{
              bottom: 4,
              left: 6,
              right: 18,
              top: 4,
            }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#d7e3e8"
              strokeDasharray="3 3"
            />

            <XAxis
              axisLine={false}
              domain={[0, 1]}
              fontSize={11}
              tickFormatter={(value: number) =>
                `${Math.round(value * 100)}%`
              }
              tickLine={false}
              type="number"
            />

            <YAxis
              axisLine={false}
              dataKey="shortLabel"
              fontSize={11}
              tickLine={false}
              type="category"
              width={72}
            />

            <Tooltip
              contentStyle={{
                border: "1px solid #d4e0e5",
                borderRadius: "10px",
                boxShadow: "0 12px 28px rgba(13, 39, 54, 0.12)",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(100, 142, 157, 0.08)" }}
              formatter={(value) => [
                `${(Number(value) * 100).toFixed(2)}%`,
                "Relative importance",
              ]}
              labelFormatter={(_, payload) =>
                payload[0]?.payload.feature ?? ""
              }
            />

            <Bar
              dataKey="importance"
              radius={[0, 7, 7, 0]}
            >
              {featureImportance.map((feature, index) => (
                <Cell
                  fill={
                    index < 2
                      ? "#ff7542"
                      : index === 4
                        ? "#d9a06f"
                        : "#6f98a8"
                  }
                  key={feature.feature}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <footer className="feature-panel__note">
        <Info aria-hidden="true" size={14} />

        <span>
          Customer age appeared in the diagnostic study but was removed
          from the deployed model for privacy.
        </span>
      </footer>
    </article>
  );
}