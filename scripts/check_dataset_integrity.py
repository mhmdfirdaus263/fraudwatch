from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"

TRAIN_PATH = RAW_DATA_DIR / "fraudTrain.csv"
TEST_PATH = RAW_DATA_DIR / "fraudTest.csv"

REQUIRED_COLUMNS = [
    "trans_num",
    "cc_num",
    "merchant",
    "unix_time",
]


def load_required_columns(file_path: Path) -> pd.DataFrame:
    return pd.read_csv(
        file_path,
        usecols=REQUIRED_COLUMNS,
        dtype={
            "trans_num": "string",
            "cc_num": "string",
            "merchant": "string",
        },
    )


def main() -> None:
    train = load_required_columns(TRAIN_PATH)
    test = load_required_columns(TEST_PATH)

    train_transactions = set(train["trans_num"])
    test_transactions = set(test["trans_num"])

    train_customers = set(train["cc_num"])
    test_customers = set(test["cc_num"])

    train_merchants = set(train["merchant"])
    test_merchants = set(test["merchant"])

    transaction_overlap = train_transactions & test_transactions
    customer_overlap = train_customers & test_customers
    merchant_overlap = train_merchants & test_merchants

    duplicate_train_ids = train["trans_num"].duplicated().sum()
    duplicate_test_ids = test["trans_num"].duplicated().sum()

    train_only_customers = train_customers - test_customers
    test_only_customers = test_customers - train_customers

    train_only_merchants = train_merchants - test_merchants
    test_only_merchants = test_merchants - train_merchants

    train_minimum_time = train["unix_time"].min()
    train_maximum_time = train["unix_time"].max()
    test_minimum_time = test["unix_time"].min()
    test_maximum_time = test["unix_time"].max()

    print("=== DATASET INTEGRITY CHECK ===")
    print(f"Duplicate train transaction IDs : {duplicate_train_ids:,}")
    print(f"Duplicate test transaction IDs  : {duplicate_test_ids:,}")
    print(f"Transaction ID overlap          : {len(transaction_overlap):,}")
    print(f"Customer overlap                : {len(customer_overlap):,}")
    print(f"Train-only customers            : {len(train_only_customers):,}")
    print(f"Test-only customers             : {len(test_only_customers):,}")
    print(f"Merchant overlap                : {len(merchant_overlap):,}")
    print(f"Train-only merchants            : {len(train_only_merchants):,}")
    print(f"Test-only merchants             : {len(test_only_merchants):,}")
    print(
        "Train unix time range           : "
        f"{train_minimum_time} - {train_maximum_time}"
    )
    print(
        "Test unix time range            : "
        f"{test_minimum_time} - {test_maximum_time}"
    )


if __name__ == "__main__":
    main()