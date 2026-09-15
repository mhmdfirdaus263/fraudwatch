import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder

from ai.evaluation.evaluate_thresholds import (
    find_best_f1_threshold,
)
from ai.features.build_features import (
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    build_features,
)
from ai.training.train_baseline import (
    RANDOM_STATE,
    TARGET_COLUMN,
    VALIDATION_FRACTION,
    calculate_metrics,
    load_training_data,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "fraudwatch_hist_gradient.joblib"
)
METRICS_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "hist_gradient_metrics.json"
)


def create_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OrdinalEncoder(
                    handle_unknown="use_encoded_value",
                    unknown_value=-1,
                ),
                list(CATEGORICAL_FEATURES),
            ),
            (
                "numerical",
                "passthrough",
                list(NUMERICAL_FEATURES),
            ),
        ],
    )

    classifier = HistGradientBoostingClassifier(
        learning_rate=0.1,
        max_iter=200,
        max_leaf_nodes=31,
        min_samples_leaf=30,
        l2_regularization=1.0,
        categorical_features=[0, 1],
        class_weight="balanced",
        early_stopping=True,
        random_state=RANDOM_STATE,
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", classifier),
        ]
    )


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

    pipeline = create_pipeline()

    print("Training histogram gradient boosting model...")
    pipeline.fit(x_train, y_train)

    probabilities = pd.Series(
        pipeline.predict_proba(x_validation)[:, 1],
        index=y_validation.index,
    )

    best_threshold = find_best_f1_threshold(
        y_validation,
        probabilities,
    )

    default_metrics = calculate_metrics(
        y_validation,
        probabilities,
        threshold=0.5,
    )
    best_f1_metrics = calculate_metrics(
        y_validation,
        probabilities,
        threshold=best_threshold,
    )

    metrics = {
        "model": "histogram_gradient_boosting",
        "training_rows": len(x_train),
        "validation_rows": len(x_validation),
        "default_threshold": default_metrics,
        "best_f1_threshold": best_f1_metrics,
    }

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

    print("\n=== HISTOGRAM GRADIENT BOOSTING METRICS ===")
    print(json.dumps(metrics, indent=2))
    print(f"\nModel saved to   : {MODEL_PATH}")
    print(f"Metrics saved to : {METRICS_PATH}")


if __name__ == "__main__":
    main()