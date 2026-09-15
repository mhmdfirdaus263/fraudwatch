import pandas as pd

from ai.inference import predictor
from backend.app.schemas.prediction import (
    PredictionLabel,
    PredictionResponse,
    RiskLevel,
    TransactionRequest,
)

MEDIUM_RISK_THRESHOLD = 0.25


def build_raw_transaction(
    request: TransactionRequest,
) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "trans_date_trans_time": (
                    request.transaction_datetime
                ),
                "category": request.category.value,
                "amt": request.amount,
                "state": request.state,
                "lat": request.customer_latitude,
                "long": request.customer_longitude,
                "city_pop": request.city_population,
                "dob": request.customer_date_of_birth,
                "merch_lat": request.merchant_latitude,
                "merch_long": request.merchant_longitude,
            }
        ]
    )


def determine_risk_level(
    fraud_score: float,
) -> RiskLevel:
    if fraud_score >= predictor.DECISION_THRESHOLD:
        return RiskLevel.CRITICAL

    if fraud_score >= predictor.REVIEW_THRESHOLD:
        return RiskLevel.HIGH

    if fraud_score >= MEDIUM_RISK_THRESHOLD:
        return RiskLevel.MEDIUM

    return RiskLevel.LOW


def predict_transaction(
    request: TransactionRequest,
) -> PredictionResponse:
    raw_transaction = build_raw_transaction(request)

    fraud_score = predictor.predict_fraud_score(
        raw_transaction
    )

    prediction = (
        PredictionLabel.FRAUD
        if fraud_score >= predictor.DECISION_THRESHOLD
        else PredictionLabel.LEGITIMATE
    )

    return PredictionResponse(
        prediction=prediction,
        fraud_score=fraud_score,
        decision_threshold=predictor.DECISION_THRESHOLD,
        risk_level=determine_risk_level(fraud_score),
        needs_review=(
            fraud_score >= predictor.REVIEW_THRESHOLD
        ),
    )