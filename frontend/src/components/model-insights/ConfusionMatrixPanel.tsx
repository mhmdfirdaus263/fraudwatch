import {
  Database,
  Snowflake,
} from "lucide-react";

import {
  confusionMatrix,
  evaluationProfile,
} from "../../data/modelInsights";

function getMatrixItem(
  actual: "Legitimate" | "Fraud",
  predicted: "Legitimate" | "Fraud",
) {
  return confusionMatrix.find(
    (item) =>
      item.actual === actual &&
      item.predicted === predicted,
  );
}

export function ConfusionMatrixPanel() {
  const trueNegative = getMatrixItem(
    "Legitimate",
    "Legitimate",
  );
  const falsePositive = getMatrixItem(
    "Legitimate",
    "Fraud",
  );
  const falseNegative = getMatrixItem(
    "Fraud",
    "Legitimate",
  );
  const truePositive = getMatrixItem("Fraud", "Fraud");

  const cells = [
    trueNegative,
    falsePositive,
    falseNegative,
    truePositive,
  ];

  return (
    <article className="insight-panel confusion-panel">
      <header className="insight-panel__header">
        <div>
          <span className="insight-panel__eyebrow">
            Final test evaluation
          </span>

          <h2>Classification outcomes</h2>
        </div>

        <span className="insight-panel__badge">
          <Snowflake aria-hidden="true" size={14} />
          Frozen test set
        </span>
      </header>

      <div className="confusion-matrix">
        <div
          aria-hidden="true"
          className="confusion-matrix__corner"
        />

        <div className="confusion-matrix__axis-title">
          Predicted class
        </div>

        <div className="confusion-matrix__column-labels">
          <span>Legitimate</span>
          <span>Fraud</span>
        </div>

        <div className="confusion-matrix__row-title">
          Actual class
        </div>

        <div className="confusion-matrix__row-labels">
          <span>Legitimate</span>
          <span>Fraud</span>
        </div>

        <div className="confusion-matrix__cells">
          {cells.map((cell) =>
            cell ? (
              <div
                className={`confusion-cell confusion-cell--${cell.tone}`}
                key={cell.key}
              >
                <span>{cell.abbreviation}</span>

                <strong>
                  {cell.value.toLocaleString("en-US")}
                </strong>

                <small>{cell.label}</small>
              </div>
            ) : null,
          )}
        </div>
      </div>

      <footer className="confusion-panel__footer">
        <span>
          <Database aria-hidden="true" size={14} />
          {evaluationProfile.testRows.toLocaleString("en-US")} test
          transactions
        </span>

        <span>
          {evaluationProfile.fraudCases.toLocaleString("en-US")} known
          fraud cases
        </span>
      </footer>
    </article>
  );
}