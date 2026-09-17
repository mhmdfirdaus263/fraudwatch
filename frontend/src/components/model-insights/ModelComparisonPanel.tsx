import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { modelComparison } from "../../data/modelInsights";

export function ModelComparisonPanel() {
  return (
    <article className="insight-panel comparison-panel">
      <header className="reference-panel-header">
        <div>
          <h2>Model Comparison (Validation Experiments)</h2>
          <p>
            Performance across different models on a validation
            dataset.
          </p>
        </div>

        <div className="comparison-panel__legend">
          <span>
            <i className="comparison-color comparison-color--precision" />
            Precision
          </span>

          <span>
            <i className="comparison-color comparison-color--recall" />
            Recall
          </span>

          <span>
            <i className="comparison-color comparison-color--f1" />
            F1 Score
          </span>

          <span>
            <i className="comparison-color comparison-color--auc" />
            PR-AUC
          </span>
        </div>
      </header>

      <div className="comparison-panel__chart">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={modelComparison}
            margin={{
              bottom: 2,
              left: -15,
              right: 8,
              top: 8,
            }}
          >
            <CartesianGrid
              stroke="#dce7eb"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              axisLine={false}
              dataKey="shortModel"
              fontSize={10}
              interval={0}
              tickLine={false}
            />

            <YAxis
              axisLine={false}
              domain={[0, 100]}
              fontSize={9}
              tickFormatter={(value: number) => `${value}%`}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                border: "1px solid #d4e0e5",
                borderRadius: "9px",
                boxShadow: "0 10px 25px rgba(13, 39, 54, 0.12)",
                fontSize: "11px",
              }}
              formatter={(value) => [
                `${Number(value).toFixed(2)}%`,
              ]}
            />

            <Legend content={() => null} />

            <Bar
              dataKey="precision"
              fill="#5f8798"
              name="Precision"
              radius={[3, 3, 0, 0]}
            />

            <Bar
              dataKey="recall"
              fill="#7eb7ce"
              name="Recall"
              radius={[3, 3, 0, 0]}
            />

            <Bar
              dataKey="f1Score"
              fill="#b4d4df"
              name="F1 Score"
              radius={[3, 3, 0, 0]}
            />

            <Bar
              dataKey="prAuc"
              fill="#ff8a5c"
              name="PR-AUC"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}