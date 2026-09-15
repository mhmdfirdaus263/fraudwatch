from collections import Counter
from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"
CHUNK_SIZE = 100_000

DATASET_FILES = [
    RAW_DATA_DIR / "fraudTrain.csv",
    RAW_DATA_DIR / "fraudTest.csv",
]


def audit_file(file_path: Path) -> None:
    header = pd.read_csv(file_path, nrows=0)

    total_rows = 0
    missing_counts = pd.Series(
        0,
        index=header.columns,
        dtype="int64",
    )
    fraud_counts: Counter[int] = Counter()
    category_counts: Counter[str] = Counter()
    customer_ids: set[str] = set()
    merchants: set[str] = set()
    minimum_date: pd.Timestamp | None = None
    maximum_date: pd.Timestamp | None = None

    for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE):
        total_rows += len(chunk)
        missing_counts = missing_counts.add(
            chunk.isna().sum(),
            fill_value=0,
        ).astype("int64")

        fraud_counts.update(chunk["is_fraud"].value_counts().to_dict())
        category_counts.update(chunk["category"].value_counts().to_dict())

        customer_ids.update(chunk["cc_num"].dropna().astype(str).unique())
        merchants.update(chunk["merchant"].dropna().astype(str).unique())

        transaction_dates = pd.to_datetime(
            chunk["trans_date_trans_time"],
            errors="coerce",
        )

        chunk_minimum = transaction_dates.min()
        chunk_maximum = transaction_dates.max()

        if pd.notna(chunk_minimum):
            if minimum_date is None or chunk_minimum < minimum_date:
                minimum_date = chunk_minimum

        if pd.notna(chunk_maximum):
            if maximum_date is None or chunk_maximum > maximum_date:
                maximum_date = chunk_maximum

    fraud_total = fraud_counts.get(1, 0)
    legitimate_total = fraud_counts.get(0, 0)
    fraud_rate = fraud_total / total_rows * 100

    missing_columns = missing_counts[missing_counts > 0]

    print(f"\n=== DATASET AUDIT: {file_path.name} ===")
    print(f"Rows                : {total_rows:,}")
    print(f"Columns             : {len(header.columns)}")
    print(f"Date range          : {minimum_date} to {maximum_date}")
    print(f"Unique customers    : {len(customer_ids):,}")
    print(f"Unique merchants    : {len(merchants):,}")
    print(f"Legitimate          : {legitimate_total:,}")
    print(f"Fraud               : {fraud_total:,}")
    print(f"Fraud rate          : {fraud_rate:.4f}%")
    print(f"Missing values      : {int(missing_counts.sum()):,}")

    if missing_columns.empty:
        print("Missing columns     : None")
    else:
        print("\nMissing values by column:")
        print(missing_columns.to_string())

    print("\nTransactions by category:")

    for category, count in category_counts.most_common():
        print(f"- {category}: {count:,}")


def main() -> None:
    for file_path in DATASET_FILES:
        if not file_path.exists():
            raise FileNotFoundError(f"Dataset not found: {file_path}")

        audit_file(file_path)


if __name__ == "__main__":
    main()