import pandas as pd

from ai.inference import predictor
from backend.app.schemas.prediction import (
    PredictionLabel,
    PredictionResponse,
    RiskLevel,
    TransactionCategory,
    TransactionRequest,
)

MEDIUM_RISK_THRESHOLD = 0.25
FRAUD_AMOUNT_MEDIAN = 396.50

HIGH_RISK_HOURS = {
    0,
    1,
    2,
    3,
    22,
    23,
}

HIGH_RISK_CATEGORIES = {
    TransactionCategory.SHOPPING_NET,
    TransactionCategory.MISC_NET,
    TransactionCategory.GROCERY_POS,
}


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


def build_risk_factors(
    request: TransactionRequest,
) -> list[str]:
    risk_factors: list[str] = []

    if request.transaction_datetime.hour in HIGH_RISK_HOURS:
        risk_factors.append(
            "Transaction occurred during a high-risk time window."
        )

    if request.category in HIGH_RISK_CATEGORIES:
        risk_factors.append(
            "Category has an elevated fraud rate in training data."
        )

    if request.amount >= FRAUD_AMOUNT_MEDIAN:
        risk_factors.append(
            "Amount is at or above the median fraudulent amount."
        )

    if not risk_factors:
        risk_factors.append(
            "No dominant contextual risk indicator was identified."
        )

    return risk_factors


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
        risk_factors=build_risk_factors(request),
    )