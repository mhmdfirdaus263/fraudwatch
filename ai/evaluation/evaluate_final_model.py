import json
from pathlib import Path
from time import perf_counter

import joblib
import pandas as pd

from ai.features.build_features import (
    REQUIRED_COLUMNS,
    build_features,
)
from ai.training.train_baseline import (
    TARGET_COLUMN,
    calculate_metrics,
)
from ai.training.train_hist_gradient import create_pipeline

PROJECT_ROOT = Path(__file__).resolve().parents[2]

TRAIN_PATH = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "fraudTrain.csv"
)
TEST_PATH = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "fraudTest.csv"
)
MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "fraudwatch_champion.joblib"
)
METRICS_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "final_test_metrics.json"
)

LOCKED_THRESHOLD = 0.9687659320172795


def load_dataset(file_path: Path) -> pd.DataFrame:
    selected_columns = sorted(
        REQUIRED_COLUMNS | {TARGET_COLUMN}
    )

    data = pd.read_csv(
        file_path,
        usecols=selected_columns,
    )

    data["trans_date_trans_time"] = pd.to_datetime(
        data["trans_date_trans_time"],
        errors="raise",
    )

    return data.sort_values(
        by="trans_date_trans_time",
        kind="stable",
    ).reset_index(drop=True)


def main() -> None:
    print("Loading full training dataset...")
    train_data = load_dataset(TRAIN_PATH)

    print("Loading frozen test dataset...")
    test_data = load_dataset(TEST_PATH)

    print("Building training features...")
    x_train = build_features(train_data)
    y_train = train_data[TARGET_COLUMN].astype(int)

    print("Building test features...")
    x_test = build_features(test_data)
    y_test = test_data[TARGET_COLUMN].astype(int)

    pipeline = create_pipeline()

    print("Refitting champion model on all training data...")
    pipeline.fit(
        x_train,
        y_train,
    )

    print("Running final test inference...")
    inference_start = perf_counter()

    probabilities = pd.Series(
        pipeline.predict_proba(x_test)[:, 1],
        index=y_test.index,
    )

    inference_seconds = perf_counter() - inference_start

    metrics = calculate_metrics(
        y_test,
        probabilities,
        threshold=LOCKED_THRESHOLD,
    )

    predictions = probabilities >= LOCKED_THRESHOLD
    predicted_alerts = int(predictions.sum())

    metrics["model"] = "histogram_gradient_boosting"
    metrics["training_rows"] = len(x_train)
    metrics["test_rows"] = len(x_test)
    metrics["test_fraud_cases"] = int(y_test.sum())
    metrics["predicted_alerts"] = predicted_alerts
    metrics["alert_rate"] = float(
        predicted_alerts / len(y_test)
    )
    metrics["inference_seconds"] = inference_seconds
    metrics["transactions_per_second"] = float(
        len(x_test) / inference_seconds
    )

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )
    METRICS_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        pipeline,
        MODEL_PATH,
    )

    with METRICS_PATH.open(
        "w",
        encoding="utf-8",
    ) as metrics_file:
        json.dump(
            metrics,
            metrics_file,
            indent=2,
        )

    print("\n=== FINAL TEST METRICS ===")
    print(json.dumps(metrics, indent=2))
    print(f"\nChampion model saved to: {MODEL_PATH}")
    print(f"Final metrics saved to  : {METRICS_PATH}")


if __name__ == "__main__":
    main()