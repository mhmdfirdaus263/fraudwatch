import type {
  PredictionResponse,
  TransactionRequest,
} from "../types/prediction";

export interface ActiveAnalysis {
  request: TransactionRequest;
  result: PredictionResponse;
}

const STORAGE_KEY = "fraudwatch.active-analysis";

function isActiveAnalysis(
  value: unknown,
): value is ActiveAnalysis {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const activeAnalysis = value as Partial<ActiveAnalysis>;

  return (
    typeof activeAnalysis.request === "object" &&
    activeAnalysis.request !== null &&
    typeof activeAnalysis.result === "object" &&
    activeAnalysis.result !== null
  );
}

export function getActiveAnalysis(): ActiveAnalysis | null {
  const storedAnalysis =
    window.sessionStorage.getItem(STORAGE_KEY);

  if (!storedAnalysis) {
    return null;
  }

  try {
    const parsedAnalysis = JSON.parse(
      storedAnalysis,
    ) as unknown;

    return isActiveAnalysis(parsedAnalysis)
      ? parsedAnalysis
      : null;
  } catch {
    return null;
  }
}

export function saveActiveAnalysis(
  request: TransactionRequest,
  result: PredictionResponse,
): void {
  const activeAnalysis: ActiveAnalysis = {
    request,
    result,
  };

  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(activeAnalysis),
  );
}

export function clearActiveAnalysis(): void {
  window.sessionStorage.removeItem(STORAGE_KEY);
}