from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"

DATASET_FILES = [
    RAW_DATA_DIR / "fraudTrain.csv",
    RAW_DATA_DIR / "fraudTest.csv",
]


def inspect_file(file_path: Path) -> None:
    sample = pd.read_csv(file_path, nrows=5)

    print(f"\n=== {file_path.name} ===")
    print(f"File size : {file_path.stat().st_size / (1024**2):.2f} MB")
    print(f"Columns   : {len(sample.columns)}")
    print("\nColumn names:")

    for index, column in enumerate(sample.columns, start=1):
        print(f"{index:>2}. {column}")

    print("\nSample data:")
    print(sample.to_string(index=False))


def main() -> None:
    for file_path in DATASET_FILES:
        if not file_path.exists():
            raise FileNotFoundError(f"Dataset not found: {file_path}")

        inspect_file(file_path)


if __name__ == "__main__":
    main()