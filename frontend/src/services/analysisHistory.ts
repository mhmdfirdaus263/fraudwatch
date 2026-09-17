import type {
  AnalysisRecord,
  PredictionResponse,
  TransactionRequest,
} from "../types/prediction";

const STORAGE_KEY = "fraudwatch.analysis-history";
const MAX_RECORDS = 50;

function isAnalysisRecord(value: unknown): value is AnalysisRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Partial<AnalysisRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.analyzed_at === "string" &&
    typeof record.request === "object" &&
    record.request !== null &&
    typeof record.result === "object" &&
    record.result !== null
  );
}

export function getAnalysisHistory(): AnalysisRecord[] {
  const storedHistory = window.localStorage.getItem(STORAGE_KEY);

  if (!storedHistory) {
    return [];
  }

  try {
    const parsedHistory = JSON.parse(storedHistory) as unknown;

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory.filter(isAnalysisRecord);
  } catch {
    return [];
  }
}

export function saveAnalysisRecord(
  request: TransactionRequest,
  result: PredictionResponse,
): AnalysisRecord {
  const record: AnalysisRecord = {
    id: crypto.randomUUID(),
    analyzed_at: new Date().toISOString(),
    request,
    result,
  };

  const updatedHistory = [
    record,
    ...getAnalysisHistory(),
  ].slice(0, MAX_RECORDS);

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedHistory),
  );

  return record;
}

export function clearAnalysisHistory(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}