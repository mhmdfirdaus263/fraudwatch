import {
  CalendarClock,
  Info,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  type FormEvent,
  useState,
} from "react";

import {
  categoryOptions,
  sampleTransaction,
  stateOptions,
} from "../../data/transactionForm";
import type {
  TransactionCategory,
  TransactionRequest,
} from "../../types/prediction";

interface TransactionFormProps {
  errorMessage: string | null;
  initialRequest: TransactionRequest | null;
  isSubmitting: boolean;
  onAnalyze: (transaction: TransactionRequest) => Promise<void>;
  onReset: () => void;
}

interface TransactionFormValues {
  transaction_datetime: string;
  category: TransactionCategory | "";
  amount: string;
  state: string;
  customer_latitude: string;
  customer_longitude: string;
  city_population: string;
  merchant_latitude: string;
  merchant_longitude: string;
}

function getCurrentLocalDateTime(): string {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

function getInitialValues(): TransactionFormValues {
  return {
    transaction_datetime: getCurrentLocalDateTime(),
    category: "shopping_net",
    amount: "",
    state: "",
    customer_latitude: "",
    customer_longitude: "",
    city_population: "",
    merchant_latitude: "",
    merchant_longitude: "",
  };
}

const emptyValues: TransactionFormValues = {
  transaction_datetime: "",
  category: "",
  amount: "",
  state: "",
  customer_latitude: "",
  customer_longitude: "",
  city_population: "",
  merchant_latitude: "",
  merchant_longitude: "",
};

function requestToFormValues(
  request: TransactionRequest,
): TransactionFormValues {
  return {
    transaction_datetime: request.transaction_datetime,
    category: request.category,
    amount: String(request.amount),
    state: request.state,
    customer_latitude: String(request.customer_latitude),
    customer_longitude: String(request.customer_longitude),
    city_population: String(request.city_population),
    merchant_latitude: String(request.merchant_latitude),
    merchant_longitude: String(request.merchant_longitude),
  };
}

export function TransactionForm({
  errorMessage,
  initialRequest,
  isSubmitting,
  onAnalyze,
  onReset,
}: TransactionFormProps) {
  const [values, setValues] = useState<TransactionFormValues>(() =>
    initialRequest
      ? requestToFormValues(initialRequest)
      : getInitialValues(),
  );

  function updateValue<Key extends keyof TransactionFormValues>(
    field: Key,
    value: TransactionFormValues[Key],
  ): void {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function loadSampleTransaction(): void {
    setValues(requestToFormValues(sampleTransaction));
    onReset();
  }

  function resetForm(): void {
    setValues(emptyValues);
    onReset();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const transaction: TransactionRequest = {
      transaction_datetime: values.transaction_datetime,
      category: values.category as TransactionCategory,
      amount: Number(values.amount),
      state: values.state,
      customer_latitude: Number(values.customer_latitude),
      customer_longitude: Number(values.customer_longitude),
      city_population: Number(values.city_population),
      merchant_latitude: Number(values.merchant_latitude),
      merchant_longitude: Number(values.merchant_longitude),
    };

    await onAnalyze(transaction);
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <header className="transaction-form__header">
        <div>
          <h2>Transaction Details</h2>

          <p>
            Enter the transaction information to receive a fraud risk
            assessment.
          </p>
        </div>

        <span className="transaction-form__privacy-note">
          <Info aria-hidden="true" size={16} />
          Date of birth is not collected.
        </span>
      </header>

      <div className="transaction-form__fields">
        <label className="form-field">
          <span>Transaction date &amp; time</span>

          <div className="form-control">
            <CalendarClock aria-hidden="true" size={16} />

            <input
              max="2035-12-31T23:59"
              min="2010-01-01T00:00"
              onChange={(event) =>
                updateValue(
                  "transaction_datetime",
                  event.target.value,
                )
              }
              required
              type="datetime-local"
              value={values.transaction_datetime}
            />
          </div>

          <small>
            Select the date and time in your local timezone.
          </small>
        </label>

        <label className="form-field">
          <span>Category</span>

          <select
            onChange={(event) =>
              updateValue(
                "category",
                event.target.value as TransactionCategory | "",
              )
            }
            required
            value={values.category}
          >
            <option disabled value="">
              Select transaction category
            </option>

            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <small>Transaction category used by the model.</small>
        </label>

        <label className="form-field">
          <span>Amount (USD)</span>

          <input
            min="0.01"
            onChange={(event) =>
              updateValue("amount", event.target.value)
            }
            placeholder="0.00"
            required
            step="0.01"
            type="number"
            value={values.amount}
          />

          <small>Transaction amount in US dollars.</small>
        </label>

        <label className="form-field">
          <span>US state</span>

          <select
            onChange={(event) =>
              updateValue("state", event.target.value)
            }
            required
            value={values.state}
          >
            <option disabled value="">
              Select US state
            </option>

            {stateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.value})
              </option>
            ))}
          </select>

          <small>Customer&apos;s US state.</small>
        </label>

        <label className="form-field">
          <span>Customer latitude</span>

          <input
            max="90"
            min="-90"
            onChange={(event) =>
              updateValue(
                "customer_latitude",
                event.target.value,
              )
            }
            placeholder="37.7749"
            required
            step="any"
            type="number"
            value={values.customer_latitude}
          />

          <small>Customer location latitude.</small>
        </label>

        <label className="form-field">
          <span>Customer longitude</span>

          <input
            max="180"
            min="-180"
            onChange={(event) =>
              updateValue(
                "customer_longitude",
                event.target.value,
              )
            }
            placeholder="-122.4194"
            required
            step="any"
            type="number"
            value={values.customer_longitude}
          />

          <small>Customer location longitude.</small>
        </label>

        <label className="form-field">
          <span>City population</span>

          <input
            min="0"
            onChange={(event) =>
              updateValue(
                "city_population",
                event.target.value,
              )
            }
            placeholder="873965"
            required
            step="1"
            type="number"
            value={values.city_population}
          />

          <small>Population of the customer&apos;s city.</small>
        </label>

        <label className="form-field">
          <span>Merchant latitude</span>

          <input
            max="90"
            min="-90"
            onChange={(event) =>
              updateValue(
                "merchant_latitude",
                event.target.value,
              )
            }
            placeholder="34.0522"
            required
            step="any"
            type="number"
            value={values.merchant_latitude}
          />

          <small>Merchant location latitude.</small>
        </label>

        <label className="form-field">
          <span>Merchant longitude</span>

          <input
            max="180"
            min="-180"
            onChange={(event) =>
              updateValue(
                "merchant_longitude",
                event.target.value,
              )
            }
            placeholder="-118.2437"
            required
            step="any"
            type="number"
            value={values.merchant_longitude}
          />

          <small>Merchant location longitude.</small>
        </label>
      </div>

      {errorMessage ? (
        <div className="transaction-form__error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <footer className="transaction-form__actions">
        <button
          className="transaction-form__submit"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="form-spinner"
                size={17}
              />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Transaction
              <Sparkles aria-hidden="true" size={17} />
            </>
          )}
        </button>

        <button
          className="transaction-form__sample"
          disabled={isSubmitting}
          onClick={loadSampleTransaction}
          type="button"
        >
          Load Example
        </button>

        <button
          className="transaction-form__reset"
          disabled={isSubmitting}
          onClick={resetForm}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={15} />
          Reset
        </button>
      </footer>
    </form>
  );
}