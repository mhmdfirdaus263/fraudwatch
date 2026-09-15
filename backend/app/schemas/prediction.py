from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, Field, model_validator


class TransactionCategory(StrEnum):
    ENTERTAINMENT = "entertainment"
    FOOD_DINING = "food_dining"
    GAS_TRANSPORT = "gas_transport"
    GROCERY_NET = "grocery_net"
    GROCERY_POS = "grocery_pos"
    HEALTH_FITNESS = "health_fitness"
    HOME = "home"
    KIDS_PETS = "kids_pets"
    MISC_NET = "misc_net"
    MISC_POS = "misc_pos"
    PERSONAL_CARE = "personal_care"
    SHOPPING_NET = "shopping_net"
    SHOPPING_POS = "shopping_pos"
    TRAVEL = "travel"


class PredictionLabel(StrEnum):
    LEGITIMATE = "legitimate"
    FRAUD = "fraud"


class RiskLevel(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TransactionRequest(BaseModel):
    transaction_datetime: datetime
    category: TransactionCategory
    amount: float = Field(gt=0)
    state: str = Field(
        min_length=2,
        max_length=2,
        pattern=r"^[A-Z]{2}$",
    )
    customer_latitude: float = Field(
        ge=-90,
        le=90,
    )
    customer_longitude: float = Field(
        ge=-180,
        le=180,
    )
    city_population: int = Field(ge=0)
    customer_date_of_birth: date
    merchant_latitude: float = Field(
        ge=-90,
        le=90,
    )
    merchant_longitude: float = Field(
        ge=-180,
        le=180,
    )

    @model_validator(mode="after")
    def validate_date_of_birth(self) -> "TransactionRequest":
        transaction_date = self.transaction_datetime.date()

        if self.customer_date_of_birth >= transaction_date:
            raise ValueError(
                "Customer date of birth must be before transaction date."
            )

        return self


class PredictionResponse(BaseModel):
    prediction: PredictionLabel
    fraud_score: float = Field(
        ge=0,
        le=1,
    )
    decision_threshold: float = Field(
        ge=0,
        le=1,
    )
    risk_level: RiskLevel
    needs_review: bool
    risk_factors: list[str]