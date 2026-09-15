from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from ai.features.build_features import build_features

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "fraudwatch_champion.joblib"
)

DECISION_THRESHOLD = 0.9687659320172795
REVIEW_THRESHOLD = 0.5


@lru_cache
def load_model() -> Any:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Champion model not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def predict_fraud_score(
    raw_transaction: pd.DataFrame,
) -> float:
    if len(raw_transaction) != 1:
        raise ValueError(
            "Prediction requires exactly one transaction."
        )

    model = load_model()
    features = build_features(raw_transaction)

    fraud_score = model.predict_proba(features)[0, 1]

    return float(fraud_score)