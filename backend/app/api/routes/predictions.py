from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.prediction import (
    PredictionResponse,
    TransactionRequest,
)
from backend.app.services.prediction import (
    predict_transaction,
)

router = APIRouter(
    prefix="/predictions",
    tags=["predictions"],
)


@router.post(
    "",
    response_model=PredictionResponse,
)
def create_prediction(
    request: TransactionRequest,
) -> PredictionResponse:
    try:
        return predict_transaction(request)
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is unavailable.",
        ) from error