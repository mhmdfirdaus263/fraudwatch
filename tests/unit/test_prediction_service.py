from datetime import datetime

import pytest

from ai.inference import predictor
from backend.app.schemas.prediction import (
    PredictionLabel,
    RiskLevel,
    TransactionCategory,
    TransactionRequest,
)
from backend.app.services.prediction import (
    build_raw_transaction,
    predict_transaction,
)


def create_transaction_request() -> TransactionRequest:
    return TransactionRequest(
        transaction_datetime=datetime(
            2026,
            9,
            15,
            22,
            30,
        ),
        category=TransactionCategory.SHOPPING_NET,
        amount=500.0,
        state="NY",
        customer_latitude=40.7128,
        customer_longitude=-74.0060,
        city_population=8_000_000,
        merchant_latitude=40.7306,
        merchant_longitude=-73.9352,
    )


def test_build_raw_transaction_maps_request_fields() -> None:
    request = create_transaction_request()

    raw_transaction = build_raw_transaction(request)

    assert len(raw_transaction) == 1
    assert raw_transaction.loc[0, "category"] == "shopping_net"
    assert raw_transaction.loc[0, "amt"] == 500.0
    assert raw_transaction.loc[0, "state"] == "NY"
    assert raw_transaction.loc[0, "city_pop"] == 8_000_000
    assert "dob" not in raw_transaction.columns


@pytest.mark.parametrize(
    (
        "fraud_score",
        "expected_label",
        "expected_risk",
        "expected_review",
    ),
    [
        (
            0.10,
            PredictionLabel.LEGITIMATE,
            RiskLevel.LOW,
            False,
        ),
        (
            0.30,
            PredictionLabel.LEGITIMATE,
            RiskLevel.MEDIUM,
            False,
        ),
        (
            0.80,
            PredictionLabel.LEGITIMATE,
            RiskLevel.HIGH,
            True,
        ),
        (
            0.99,
            PredictionLabel.FRAUD,
            RiskLevel.CRITICAL,
            True,
        ),
    ],
)
def test_predict_transaction_applies_risk_rules(
    monkeypatch: pytest.MonkeyPatch,
    fraud_score: float,
    expected_label: PredictionLabel,
    expected_risk: RiskLevel,
    expected_review: bool,
) -> None:
    request = create_transaction_request()

    monkeypatch.setattr(
        predictor,
        "predict_fraud_score",
        lambda raw_transaction: fraud_score,
    )

    response = predict_transaction(request)

    assert response.prediction == expected_label
    assert response.fraud_score == fraud_score
    assert response.risk_level == expected_risk
    assert response.needs_review is expected_review
    assert (
        response.decision_threshold
        == predictor.DECISION_THRESHOLD
    )
    assert response.risk_factors == [
        "Transaction occurred during a high-risk time window.",
        "Category has an elevated fraud rate in training data.",
        "Amount is at or above the median fraudulent amount.",
    ]