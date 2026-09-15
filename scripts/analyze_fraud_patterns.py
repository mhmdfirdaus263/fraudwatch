from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TRAIN_PATH = PROJECT_ROOT / "data" / "raw" / "fraudTrain.csv"

REQUIRED_COLUMNS = [
    "trans_date_trans_time",
    "category",
    "amt",
    "gender",
    "is_fraud",
]


def load_training_data() -> pd.DataFrame:
    data = pd.read_csv(
        TRAIN_PATH,
        usecols=REQUIRED_COLUMNS,
    )

    data["trans_date_trans_time"] = pd.to_datetime(
        data["trans_date_trans_time"],
        errors="raise",
    )
    data["transaction_hour"] = data["trans_date_trans_time"].dt.hour

    return data


def print_category_summary(data: pd.DataFrame) -> None:
    summary = (
        data.groupby("category")["is_fraud"]
        .agg(
            transactions="size",
            fraud_cases="sum",
            fraud_rate="mean",
        )
        .sort_values("fraud_rate", ascending=False)
    )

    summary["fraud_rate"] *= 100

    print("\n=== FRAUD BY CATEGORY ===")
    print(summary.to_string(float_format=lambda value: f"{value:.4f}"))


def print_hour_summary(data: pd.DataFrame) -> None:
    summary = (
        data.groupby("transaction_hour")["is_fraud"]
        .agg(
            transactions="size",
            fraud_cases="sum",
            fraud_rate="mean",
        )
        .sort_values("fraud_rate", ascending=False)
    )

    summary["fraud_rate"] *= 100

    print("\n=== FRAUD BY TRANSACTION HOUR ===")
    print(summary.to_string(float_format=lambda value: f"{value:.4f}"))


def print_amount_summary(data: pd.DataFrame) -> None:
    summary = data.groupby("is_fraud")["amt"].agg(
        transactions="size",
        mean="mean",
        median="median",
        minimum="min",
        maximum="max",
    )

    print("\n=== TRANSACTION AMOUNT BY TARGET ===")
    print(summary.to_string(float_format=lambda value: f"{value:.2f}"))


def print_gender_summary(data: pd.DataFrame) -> None:
    summary = data.groupby("gender")["is_fraud"].agg(
        transactions="size",
        fraud_cases="sum",
        fraud_rate="mean",
    )

    summary["fraud_rate"] *= 100

    print("\n=== FRAUD BY GENDER ===")
    print(summary.to_string(float_format=lambda value: f"{value:.4f}"))


def main() -> None:
    data = load_training_data()

    print(f"Training rows: {len(data):,}")

    print_category_summary(data)
    print_hour_summary(data)
    print_amount_summary(data)
    print_gender_summary(data)


if __name__ == "__main__":
    main()