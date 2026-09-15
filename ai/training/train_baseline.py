import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from ai.features.build_features import (
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    REQUIRED_COLUMNS,
    build_features,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
TRAIN_PATH = PROJECT_ROOT / "data" / "raw" / "fraudTrain.csv"
MODEL_PATH = PROJECT_ROOT / "models" / "fraudwatch_baseline.joblib"
METRICS_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "baseline_metrics.json"
)

TARGET_COLUMN = "is_fraud"
VALIDATION_FRACTION = 0.20
RANDOM_STATE = 42


def load_training_data() -> pd.DataFrame:
    selected_columns = sorted(REQUIRED_COLUMNS | {TARGET_COLUMN})

    data = pd.read_csv(
        TRAIN_PATH,
        usecols=selected_columns,
    )

    data["trans_date_trans_time"] = pd.to_datetime(
        data["trans_date_trans_time"],
        errors="raise",
    )

    data = data.sort_values(
        by="trans_date_trans_time",
        kind="stable",
    ).reset_index(drop=True)

    return data


def create_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                ),
                list(CATEGORICAL_FEATURES),
            ),
            (
                "numerical",
                StandardScaler(),
                list(NUMERICAL_FEATURES),
            ),
        ],
    )

    classifier = LogisticRegression(
        class_weight="balanced",
        solver="saga",
        max_iter=500,
        tol=1e-3,
        random_state=RANDOM_STATE,
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", classifier),
        ]
    )


def calculate_metrics(
    y_true: pd.Series,
    probabilities: pd.Series,
    threshold: float = 0.5,
) -> dict[str, float | int | list[list[int]]]:
    predictions = (probabilities >= threshold).astype(int)

    return {
        "threshold": threshold,
        "precision": float(
            precision_score(
                y_true,
                predictions,
                zero_division=0,
            )
        ),
        "recall": float(
            recall_score(
                y_true,
                predictions,
                zero_division=0,
            )
        ),
        "f1_score": float(
            f1_score(
                y_true,
                predictions,
                zero_division=0,
            )
        ),
        "pr_auc": float(
            average_precision_score(
                y_true,
                probabilities,
            )
        ),
        "roc_auc": float(
            roc_auc_score(
                y_true,
                probabilities,
            )
        ),
        "confusion_matrix": confusion_matrix(
            y_true,
            predictions,
        ).tolist(),
    }


def main() -> None:
    print("Loading training dataset...")
    raw_data = load_training_data()

    print("Building model features...")
    features = build_features(raw_data)
    target = raw_data[TARGET_COLUMN].astype(int)

    split_index = int(
        len(raw_data) * (1 - VALIDATION_FRACTION)
    )

    x_train = features.iloc[:split_index]
    x_validation = features.iloc[split_index:]
    y_train = target.iloc[:split_index]
    y_validation = target.iloc[split_index:]

    print(f"Training rows   : {len(x_train):,}")
    print(f"Validation rows : {len(x_validation):,}")
    print(
        "Validation period: "
        f"{raw_data.iloc[split_index]['trans_date_trans_time']} "
        "to "
        f"{raw_data.iloc[-1]['trans_date_trans_time']}"
    )

    pipeline = create_pipeline()

    print("Training baseline model...")
    pipeline.fit(x_train, y_train)

    validation_probabilities = pd.Series(
        pipeline.predict_proba(x_validation)[:, 1],
        index=y_validation.index,
    )

    metrics = calculate_metrics(
        y_validation,
        validation_probabilities,
    )
    metrics["training_rows"] = len(x_train)
    metrics["validation_rows"] = len(x_validation)

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )
    METRICS_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(pipeline, MODEL_PATH)

    with METRICS_PATH.open(
        "w",
        encoding="utf-8",
    ) as metrics_file:
        json.dump(
            metrics,
            metrics_file,
            indent=2,
        )

    print("\n=== BASELINE VALIDATION METRICS ===")
    print(json.dumps(metrics, indent=2))
    print(f"\nModel saved to   : {MODEL_PATH}")
    print(f"Metrics saved to : {METRICS_PATH}")


if __name__ == "__main__":
    main()