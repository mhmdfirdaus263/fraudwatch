import type {
  PredictionResponse,
  TransactionRequest,
} from "../types/prediction";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const PREDICTION_ENDPOINT = `${API_BASE_URL}/api/v1/predictions`;

interface ValidationErrorItem {
  loc?: Array<string | number>;
  msg?: string;
}

interface ApiErrorResponse {
  detail?: string | ValidationErrorItem[];
}

export class PredictionApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PredictionApiError";
    this.status = status;
  }
}

function getErrorMessage(payload: ApiErrorResponse): string {
  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((error) => {
        const field = error.loc?.at(-1);
        const message = error.msg ?? "Invalid value";

        return field ? `${String(field)}: ${message}` : message;
      })
      .join(" ");
  }

  return "The prediction service could not process this transaction.";
}

async function readErrorResponse(
  response: Response,
): Promise<ApiErrorResponse> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return {};
  }
}

export async function analyzeTransaction(
  transaction: TransactionRequest,
): Promise<PredictionResponse> {
  let response: Response;

  try {
    response = await fetch(PREDICTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
  } catch {
    throw new PredictionApiError(
      "Unable to reach the FraudWatch API. Make sure the FastAPI server is running.",
      0,
    );
  }

  if (!response.ok) {
    const payload = await readErrorResponse(response);

    throw new PredictionApiError(
      getErrorMessage(payload),
      response.status,
    );
  }

  return (await response.json()) as PredictionResponse;
}