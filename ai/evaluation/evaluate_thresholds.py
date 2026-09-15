import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import precision_recall_curve

from ai.features.build_features import build_features
from ai.training.train_baseline import (
    MODEL_PATH,
    TARGET_COLUMN,
    VALIDATION_FRACTION,
    calculate_metrics,
    load_training_data,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "threshold_analysis.json"
)

RECALL_TARGETS = (
    0.90,
    0.80,
    0.70,
)


def find_best_f1_threshold(
    y_true: pd.Series,
    probabilities: pd.Series,
) -> float:
    precision, recall, thresholds = precision_recall_curve(
        y_true,
        probabilities,
    )

    precision = precision[:-1]
    recall = recall[:-1]

    denominator = precision + recall
    f1_scores = np.divide(
        2 * precision * recall,
        denominator,
        out=np.zeros_like(denominator),
        where=denominator > 0,
    )

    best_index = int(np.argmax(f1_scores))

    return float(thresholds[best_index])


def find_threshold_for_recall(
    y_true: pd.Series,
    probabilities: pd.Series,
    recall_target: float,
) -> float:
    precision, recall, thresholds = precision_recall_curve(
        y_true,
        probabilities,
    )

    precision = precision[:-1]
    recall = recall[:-1]

    valid_indices = np.flatnonzero(recall >= recall_target)

    if len(valid_indices) == 0:
        raise ValueError(
            f"No threshold satisfies recall target {recall_target}."
        )

    best_index = valid_indices[
        np.argmax(precision[valid_indices])
    ]

    return float(thresholds[best_index])


def evaluate_threshold(
    y_true: pd.Series,
    probabilities: pd.Series,
    threshold: float,
) -> dict[str, float | int | list[list[int]]]:
    metrics = calculate_metrics(
        y_true,
        probabilities,
        threshold,
    )

    predictions = probabilities >= threshold
    predicted_alerts = int(predictions.sum())

    metrics["predicted_alerts"] = predicted_alerts
    metrics["alert_rate"] = float(
        predicted_alerts / len(predictions)
    )

    return metrics


def main() -> None:
    print("Loading validation data...")
    raw_data = load_training_data()
    features = build_features(raw_data)
    target = raw_data[TARGET_COLUMN].astype(int)

    split_index = int(
        len(raw_data) * (1 - VALIDATION_FRACTION)
    )

    x_validation = features.iloc[split_index:]
    y_validation = target.iloc[split_index:]

    print("Loading baseline model...")
    pipeline = joblib.load(MODEL_PATH)

    probabilities = pd.Series(
        pipeline.predict_proba(x_validation)[:, 1],
        index=y_validation.index,
    )

    threshold_results = {
        "default_0.5": evaluate_threshold(
            y_validation,
            probabilities,
            0.5,
        ),
        "best_f1": evaluate_threshold(
            y_validation,
            probabilities,
            find_best_f1_threshold(
                y_validation,
                probabilities,
            ),
        ),
    }

    for recall_target in RECALL_TARGETS:
        result_name = f"recall_{int(recall_target * 100)}"

        threshold = find_threshold_for_recall(
            y_validation,
            probabilities,
            recall_target,
        )

        threshold_results[result_name] = evaluate_threshold(
            y_validation,
            probabilities,
            threshold,
        )

    OUTPUT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with OUTPUT_PATH.open(
        "w",
        encoding="utf-8",
    ) as output_file:
        json.dump(
            threshold_results,
            output_file,
            indent=2,
        )

    print("\n=== THRESHOLD ANALYSIS ===")
    print(json.dumps(threshold_results, indent=2))
    print(f"\nResults saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()