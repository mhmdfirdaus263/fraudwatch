from collections.abc import Sequence

import numpy as np
import pandas as pd

EARTH_RADIUS_KM = 6_371.0

REQUIRED_COLUMNS = {
    "trans_date_trans_time",
    "category",
    "amt",
    "state",
    "lat",
    "long",
    "city_pop",
    "dob",
    "merch_lat",
    "merch_long",
}

CATEGORICAL_FEATURES: Sequence[str] = (
    "category",
    "state",
)

NUMERICAL_FEATURES: Sequence[str] = (
    "amount",
    "amount_log",
    "city_population",
    "customer_age",
    "distance_km",
    "hour_sin",
    "hour_cos",
    "weekday_sin",
    "weekday_cos",
)


def validate_columns(data: pd.DataFrame) -> None:
    missing_columns = REQUIRED_COLUMNS - set(data.columns)

    if missing_columns:
        missing_list = ", ".join(sorted(missing_columns))
        raise ValueError(f"Missing required columns: {missing_list}")


def calculate_distance_km(data: pd.DataFrame) -> pd.Series:
    customer_latitude = np.radians(data["lat"].astype(float))
    customer_longitude = np.radians(data["long"].astype(float))
    merchant_latitude = np.radians(data["merch_lat"].astype(float))
    merchant_longitude = np.radians(data["merch_long"].astype(float))

    latitude_difference = merchant_latitude - customer_latitude
    longitude_difference = merchant_longitude - customer_longitude

    haversine_value = (
        np.sin(latitude_difference / 2) ** 2
        + np.cos(customer_latitude)
        * np.cos(merchant_latitude)
        * np.sin(longitude_difference / 2) ** 2
    )
    haversine_value = np.clip(haversine_value, 0, 1)

    angular_distance = 2 * np.arctan2(
        np.sqrt(haversine_value),
        np.sqrt(1 - haversine_value),
    )

    return pd.Series(
        EARTH_RADIUS_KM * angular_distance,
        index=data.index,
        name="distance_km",
    )


def build_features(data: pd.DataFrame) -> pd.DataFrame:
    validate_columns(data)

    transaction_time = pd.to_datetime(
        data["trans_date_trans_time"],
        errors="raise",
    )
    birth_date = pd.to_datetime(
        data["dob"],
        errors="raise",
    )

    transaction_hour = transaction_time.dt.hour
    transaction_weekday = transaction_time.dt.dayofweek

    customer_age = (
        (transaction_time - birth_date).dt.days / 365.25
    ).clip(lower=0)

    features = pd.DataFrame(
        {
            "category": data["category"].astype("string"),
            "state": data["state"].astype("string"),
            "amount": data["amt"].astype(float),
            "amount_log": np.log1p(data["amt"].astype(float)),
            "city_population": data["city_pop"].astype(float),
            "customer_age": customer_age,
            "distance_km": calculate_distance_km(data),
            "hour_sin": np.sin(2 * np.pi * transaction_hour / 24),
            "hour_cos": np.cos(2 * np.pi * transaction_hour / 24),
            "weekday_sin": np.sin(
                2 * np.pi * transaction_weekday / 7
            ),
            "weekday_cos": np.cos(
                2 * np.pi * transaction_weekday / 7
            ),
        },
        index=data.index,
    )

    return features