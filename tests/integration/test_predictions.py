import pytest
from fastapi.testclient import TestClient

from backend.app.api.routes import predictions as route_module
from backend.app.main import app
from backend.app.schemas.prediction import (
    PredictionLabel,
    PredictionResponse,
    RiskLevel,
    TransactionRequest,
)

client = TestClient(app)

VALID_REQUEST = {
    "transaction_datetime": "2026-09-15T22:30:00",
    "category": "shopping_net",
    "amount": 500.0,
    "state": "NY",
    "customer_latitude": 40.7128,
    "customer_longitude": -74.0060,
    "city_population": 8000000,
    "merchant_latitude": 40.7306,
    "merchant_longitude": -73.9352,
}


def test_create_prediction_returns_risk_result(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    def fake_prediction(
        request: TransactionRequest,
    ) -> PredictionResponse:
        return PredictionResponse(
            prediction=PredictionLabel.FRAUD,
            fraud_score=0.99,
            decision_threshold=0.9796734656451997,
            risk_level=RiskLevel.CRITICAL,
            needs_review=True,
            risk_factors=[
                (
                    "Transaction occurred during a "
                    "high-risk time window."
                ),
                (
                    "Category has an elevated fraud "
                    "rate in training data."
                ),
                (
                    "Amount is at or above the median "
                    "fraudulent amount."
                ),
            ],
        )

    monkeypatch.setattr(
        route_module,
        "predict_transaction",
        fake_prediction,
    )

    response = client.post(
        "/api/v1/predictions",
        json=VALID_REQUEST,
    )

    assert response.status_code == 200
    assert response.json() == {
        "prediction": "fraud",
        "fraud_score": 0.99,
        "decision_threshold": 0.9796734656451997,
        "risk_level": "critical",
        "needs_review": True,
        "risk_factors": [
            (
                "Transaction occurred during a "
                "high-risk time window."
            ),
            (
                "Category has an elevated fraud "
                "rate in training data."
            ),
            (
                "Amount is at or above the median "
                "fraudulent amount."
            ),
        ],
    }


def test_create_prediction_rejects_invalid_state() -> None:
    invalid_request = {
        **VALID_REQUEST,
        "state": "New York",
    }

    response = client.post(
        "/api/v1/predictions",
        json=invalid_request,
    )

    assert response.status_code == 422