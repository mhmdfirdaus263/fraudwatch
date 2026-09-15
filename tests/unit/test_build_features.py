import pandas as pd
import pytest

from ai.features.build_features import build_features


def create_sample_data() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "trans_date_trans_time": [
                "2024-01-01 00:00:00",
                "2024-01-02 12:30:00",
            ],
            "category": [
                "shopping_net",
                "gas_transport",
            ],
            "amt": [
                100.0,
                50.0,
            ],
            "state": [
                "NY",
                "CA",
            ],
            "lat": [
                40.0,
                34.0,
            ],
            "long": [
                -74.0,
                -118.0,
            ],
            "city_pop": [
                1_000_000,
                500_000,
            ],
            "dob": [
                "1994-01-01",
                "2000-06-15",
            ],
            "merch_lat": [
                40.0,
                35.0,
            ],
            "merch_long": [
                -74.0,
                -117.0,
            ],
        }
    )


def test_build_features_returns_expected_columns() -> None:
    data = create_sample_data()

    features = build_features(data)

    assert list(features.columns) == [
        "category",
        "state",
        "amount",
        "amount_log",
        "city_population",
        "customer_age",
        "distance_km",
        "hour_sin",
        "hour_cos",
        "weekday_sin",
        "weekday_cos",
    ]
    assert len(features) == len(data)


def test_build_features_calculates_derived_values() -> None:
    data = create_sample_data()

    features = build_features(data)

    assert features.loc[0, "customer_age"] == pytest.approx(
        30.0,
        abs=0.1,
    )
    assert features.loc[0, "distance_km"] == pytest.approx(
        0.0,
        abs=0.001,
    )
    assert features.loc[1, "distance_km"] > 0
    assert features.loc[0, "amount_log"] > 0


def test_build_features_rejects_missing_columns() -> None:
    data = create_sample_data().drop(columns=["dob"])

    with pytest.raises(
        ValueError,
        match="Missing required columns: dob",
    ):
        build_features(data)