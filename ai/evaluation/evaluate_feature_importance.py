import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

from ai.features.build_features import build_features
from ai.training.train_baseline import (
    RANDOM_STATE,
    TARGET_COLUMN,
    VALIDATION_FRACTION,
    load_training_data,
)
from ai.training.train_hist_gradient import (
    MODEL_PATH as HIST_GRADIENT_MODEL_PATH,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "feature_importance.json"
)

SAMPLE_SIZE = 50_000
REPEAT_COUNT = 5


def main() -> None:
    print("Loading chronological validation data...")
    raw_data = load_training_data()

    split_index = int(
        len(raw_data) * (1 - VALIDATION_FRACTION)
    )

    validation_data = raw_data.iloc[split_index:]
    validation_features = build_features(validation_data)
    validation_target = validation_data[
        TARGET_COLUMN
    ].astype(int)

    sample_size = min(
        SAMPLE_SIZE,
        len(validation_features),
    )

    x_sample, _, y_sample, _ = train_test_split(
        validation_features,
        validation_target,
        train_size=sample_size,
        stratify=validation_target,
        random_state=RANDOM_STATE,
    )

    if not HIST_GRADIENT_MODEL_PATH.exists():
        raise FileNotFoundError(
            "Validation champion model is unavailable. "
            f"Expected: {HIST_GRADIENT_MODEL_PATH}"
        )

    print(f"Evaluation sample rows: {len(x_sample):,}")
    print("Loading validation champion model...")

    model = joblib.load(HIST_GRADIENT_MODEL_PATH)

    print("Calculating permutation importance...")

    result = permutation_importance(
        model,
        x_sample,
        y_sample,
        scoring="average_precision",
        n_repeats=REPEAT_COUNT,
        random_state=RANDOM_STATE,
        n_jobs=1,
    )

    importance_table = pd.DataFrame(
        {
            "feature": x_sample.columns,
            "importance_mean": result.importances_mean,
            "importance_std": result.importances_std,
        }
    ).sort_values(
        "importance_mean",
        ascending=False,
    )

    records = importance_table.to_dict(
        orient="records"
    )

    output = {
        "model": "histogram_gradient_boosting",
        "scoring": "average_precision",
        "sample_rows": len(x_sample),
        "repeats": REPEAT_COUNT,
        "features": records,
    }

    OUTPUT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with OUTPUT_PATH.open(
        "w",
        encoding="utf-8",
    ) as output_file:
        json.dump(
            output,
            output_file,
            indent=2,
        )

    print("\n=== GLOBAL FEATURE IMPORTANCE ===")
    print(
        importance_table.to_string(
            index=False,
            float_format=lambda value: f"{value:.6f}",
        )
    )
    print(f"\nResults saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()