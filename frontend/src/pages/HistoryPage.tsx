import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  MapPin,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import {
  clearAnalysisHistory,
  deleteAnalysisRecord,
  getAnalysisHistory,
} from "../services/analysisHistory";
import type {
  AnalysisRecord,
  PredictionLabel,
  RiskLevel,
} from "../types/prediction";

import "./history.css";

type PredictionFilter = "all" | PredictionLabel;
type RiskFilter = "all" | RiskLevel;
type SortOrder = "newest" | "oldest";

const PAGE_SIZE = 10;

function formatCategory(category: string): string {
  return category
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function formatAnalyzedDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function HistoryPage() {
  const initialRecords = getAnalysisHistory();

  const [records, setRecords] =
    useState<AnalysisRecord[]>(initialRecords);

  const [selectedRecordId, setSelectedRecordId] = useState<
    string | null
  >(initialRecords[0]?.id ?? null);

  const [selectedRecordIds, setSelectedRecordIds] =
    useState<Set<string>>(() => new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [predictionFilter, setPredictionFilter] =
    useState<PredictionFilter>("all");
  const [riskFilter, setRiskFilter] =
    useState<RiskFilter>("all");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("newest");
  const [page, setPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return records
      .filter((record) => {
        const matchesPrediction =
          predictionFilter === "all" ||
          record.result.prediction === predictionFilter;

        const matchesRisk =
          riskFilter === "all" ||
          record.result.risk_level === riskFilter;

        const searchableContent = [
          record.request.amount,
          record.request.category,
          formatCategory(record.request.category),
          record.request.state,
          record.result.prediction,
          record.result.risk_level,
          record.result.fraud_score,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedQuery.length === 0 ||
          searchableContent.includes(normalizedQuery);

        return (
          matchesPrediction &&
          matchesRisk &&
          matchesSearch
        );
      })
      .sort((firstRecord, secondRecord) => {
        const firstTime = new Date(
          firstRecord.analyzed_at,
        ).getTime();

        const secondTime = new Date(
          secondRecord.analyzed_at,
        ).getTime();

        return sortOrder === "newest"
          ? secondTime - firstTime
          : firstTime - secondTime;
      });
  }, [
    predictionFilter,
    records,
    riskFilter,
    searchQuery,
    sortOrder,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;

  const paginatedRecords = filteredRecords.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const firstVisibleRecord =
    filteredRecords.length === 0 ? 0 : pageStart + 1;

  const lastVisibleRecord = Math.min(
    pageStart + PAGE_SIZE,
    filteredRecords.length,
  );

  const selectedRecord =
    records.find(
      (record) => record.id === selectedRecordId,
    ) ?? null;

  const allVisibleSelected =
    paginatedRecords.length > 0 &&
    paginatedRecords.every((record) =>
      selectedRecordIds.has(record.id),
    );

  const someVisibleSelected =
    paginatedRecords.some((record) =>
      selectedRecordIds.has(record.id),
    ) && !allVisibleSelected;

  const summary = useMemo(() => {
    const fraud = records.filter(
      (record) =>
        record.result.prediction === "fraud",
    ).length;

    const legitimate = records.filter(
      (record) =>
        record.result.prediction === "legitimate",
    ).length;

    const needsReview = records.filter(
      (record) => record.result.needs_review,
    ).length;

    return {
      total: records.length,
      fraud,
      legitimate,
      needsReview,
    };
  }, [records]);

  function resetPage() {
    setPage(1);
  }

  function toggleRecordSelection(recordId: string) {
    setSelectedRecordIds((currentIds) => {
      const updatedIds = new Set(currentIds);

      if (updatedIds.has(recordId)) {
        updatedIds.delete(recordId);
      } else {
        updatedIds.add(recordId);
      }

      return updatedIds;
    });
  }

  function toggleVisibleRecords() {
    setSelectedRecordIds((currentIds) => {
      const updatedIds = new Set(currentIds);

      if (allVisibleSelected) {
        paginatedRecords.forEach((record) => {
          updatedIds.delete(record.id);
        });
      } else {
        paginatedRecords.forEach((record) => {
          updatedIds.add(record.id);
        });
      }

      return updatedIds;
    });
  }

  function removeRecords(recordIds: Set<string>) {
    recordIds.forEach((recordId) => {
      deleteAnalysisRecord(recordId);
    });

    const remainingRecords = records.filter(
      (record) => !recordIds.has(record.id),
    );

    setRecords(remainingRecords);

    setSelectedRecordIds((currentIds) => {
      const updatedIds = new Set(currentIds);

      recordIds.forEach((recordId) => {
        updatedIds.delete(recordId);
      });

      return updatedIds;
    });

    if (
      selectedRecordId &&
      recordIds.has(selectedRecordId)
    ) {
      setSelectedRecordId(
        remainingRecords[0]?.id ?? null,
      );
    }
  }

  function handleDeleteOne(recordId: string) {
    const confirmed = window.confirm(
      "Delete this analysis from local history?",
    );

    if (!confirmed) {
      return;
    }

    removeRecords(new Set([recordId]));
  }

  function handleDeleteSelected() {
    if (selectedRecordIds.size === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedRecordIds.size} selected ${
        selectedRecordIds.size === 1
          ? "analysis"
          : "analyses"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    removeRecords(selectedRecordIds);
  }

  function handleClearHistory() {
    const confirmed = window.confirm(
      "Clear all locally stored analysis history? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    clearAnalysisHistory();
    setRecords([]);
    setSelectedRecordId(null);
    setSelectedRecordIds(new Set());
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((currentPageValue) =>
      Math.max(1, currentPageValue - 1),
    );
  }

  function goToNextPage() {
    setPage((currentPageValue) =>
      Math.min(totalPages, currentPageValue + 1),
    );
  }

  return (
    <main className="history-page page-enter">
      <section className="history-container">
        <header className="history-heading">
          <div>
            <h1>Review History</h1>
            <p>
              Transactions analyzed in this browser.
            </p>
          </div>

          <div className="history-storage-note">
            <Database size={16} />

            <div>
              <strong>Local browser storage</strong>
              <span>
                {records.length}{" "}
                {records.length === 1
                  ? "analysis"
                  : "analyses"}{" "}
                stored locally
              </span>
            </div>
          </div>
        </header>

        <section
          className="history-summary"
          aria-label="History summary"
        >
          <article className="history-summary-card">
            <span className="history-summary-icon">
              <Database size={21} />
            </span>

            <div className="history-summary-content">
              <span>Total Analyses</span>
              <strong>{summary.total}</strong>
              <small>Transactions analyzed</small>
            </div>

            <div
              className="history-mini-bars"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>

          <article className="history-summary-card history-summary-card--fraud">
            <span className="history-summary-icon">
              <AlertTriangle size={21} />
            </span>

            <div className="history-summary-content">
              <span>Flagged Fraud</span>
              <strong>{summary.fraud}</strong>
              <small>
                {summary.total > 0
                  ? `${(
                      (summary.fraud / summary.total) *
                      100
                    ).toFixed(1)}% of total`
                  : "0% of total"}
              </small>
            </div>

            <div
              className="history-mini-bars"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>

          <article className="history-summary-card history-summary-card--review">
            <span className="history-summary-icon">
              <Clock3 size={21} />
            </span>

            <div className="history-summary-content">
              <span>Needs Review</span>
              <strong>{summary.needsReview}</strong>
              <small>
                {summary.total > 0
                  ? `${(
                      (summary.needsReview /
                        summary.total) *
                      100
                    ).toFixed(1)}% of total`
                  : "0% of total"}
              </small>
            </div>

            <div
              className="history-mini-bars"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>

          <article className="history-summary-card history-summary-card--legitimate">
            <span className="history-summary-icon">
              <ShieldCheck size={21} />
            </span>

            <div className="history-summary-content">
              <span>Legitimate</span>
              <strong>{summary.legitimate}</strong>
              <small>
                {summary.total > 0
                  ? `${(
                      (summary.legitimate /
                        summary.total) *
                      100
                    ).toFixed(1)}% of total`
                  : "0% of total"}
              </small>
            </div>

            <div
              className="history-mini-bars"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>
        </section>

        <section className="history-toolbar">
          <label className="history-search">
            <Search size={15} />

            <input
              type="search"
              value={searchQuery}
              placeholder="Search by amount or category..."
              aria-label="Search analysis history"
              onChange={(event) => {
                setSearchQuery(event.target.value);
                resetPage();
              }}
            />
          </label>

          <label className="history-select">
            <span className="sr-only">
              Filter prediction
            </span>

            <select
              value={predictionFilter}
              onChange={(event) => {
                setPredictionFilter(
                  event.target
                    .value as PredictionFilter,
                );
                resetPage();
              }}
            >
              <option value="all">
                All Predictions
              </option>
              <option value="fraud">Fraud</option>
              <option value="legitimate">
                Legitimate
              </option>
            </select>

            <ChevronDown size={14} />
          </label>

          <label className="history-select">
            <span className="sr-only">
              Filter risk level
            </span>

            <select
              value={riskFilter}
              onChange={(event) => {
                setRiskFilter(
                  event.target.value as RiskFilter,
                );
                resetPage();
              }}
            >
              <option value="all">
                All Risk Levels
              </option>
              <option value="low">Low risk</option>
              <option value="medium">
                Medium risk
              </option>
              <option value="high">High risk</option>
              <option value="critical">
                Critical risk
              </option>
            </select>

            <ChevronDown size={14} />
          </label>

          <label className="history-select">
            <span className="sr-only">
              Sort history
            </span>

            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(
                  event.target.value as SortOrder,
                );
                resetPage();
              }}
            >
              <option value="newest">
                Newest First
              </option>
              <option value="oldest">
                Oldest First
              </option>
            </select>

            <ChevronDown size={14} />
          </label>

          {selectedRecordIds.size > 0 ? (
            <button
              className="history-bulk-delete-button"
              type="button"
              onClick={handleDeleteSelected}
            >
              <Trash2 size={15} />
              Delete selected ({selectedRecordIds.size})
            </button>
          ) : (
            records.length > 0 && (
              <button
                className="history-clear-button"
                type="button"
                onClick={handleClearHistory}
              >
                <Trash2 size={15} />
                Clear History
              </button>
            )
          )}
        </section>

        {records.length === 0 ? (
          <section className="history-empty">
            <span>
              <Database size={27} />
            </span>

            <h2>No analysis history yet</h2>

            <p>
              Successful transaction analyses will
              automatically appear here.
            </p>
          </section>
        ) : (
          <section className="history-workspace">
            <div className="history-table-panel">
              {filteredRecords.length === 0 ? (
                <div className="history-no-results">
                  <Search size={24} />
                  <h2>No matching analyses</h2>
                  <p>
                    Try changing the search or filter.
                  </p>
                </div>
              ) : (
                <>
                  <div className="history-table-scroll">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th className="history-checkbox-column">
                            <input
                              type="checkbox"
                              checked={allVisibleSelected}
                              ref={(input) => {
                                if (input) {
                                  input.indeterminate =
                                    someVisibleSelected;
                                }
                              }}
                              aria-label="Select all visible analyses"
                              onChange={toggleVisibleRecords}
                            />
                          </th>

                          <th>Analyzed at</th>
                          <th>Amount</th>
                          <th>Category</th>
                          <th>State</th>
                          <th>Model score</th>
                          <th>Prediction</th>
                          <th>Risk</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedRecords.map((record) => {
                          const isSelected =
                            selectedRecordId === record.id;

                          const isChecked =
                            selectedRecordIds.has(
                              record.id,
                            );

                          return (
                            <tr
                              key={record.id}
                              className={
                                isSelected
                                  ? "history-row history-row--selected"
                                  : "history-row"
                              }
                              onClick={() =>
                                setSelectedRecordId(
                                  record.id,
                                )
                              }
                            >
                              <td className="history-checkbox-column">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  aria-label={`Select analysis from ${formatAnalyzedDate(
                                    record.analyzed_at,
                                  )}`}
                                  onClick={(event) =>
                                    event.stopPropagation()
                                  }
                                  onChange={() =>
                                    toggleRecordSelection(
                                      record.id,
                                    )
                                  }
                                />
                              </td>

                              <td>
                                {formatAnalyzedDate(
                                  record.analyzed_at,
                                )}
                              </td>

                              <td>
                                <strong>
                                  {formatAmount(
                                    record.request.amount,
                                  )}
                                </strong>
                              </td>

                              <td>
                                {formatCategory(
                                  record.request.category,
                                )}
                              </td>

                              <td>
                                {record.request.state}
                              </td>

                              <td>
                                <strong>
                                  {record.result.fraud_score.toFixed(
                                    4,
                                  )}
                                </strong>
                              </td>

                              <td>
                                <span
                                  className={`history-prediction history-prediction--${record.result.prediction}`}
                                >
                                  {
                                    record.result
                                      .prediction
                                  }
                                </span>
                              </td>

                              <td>
                                <span
                                  className={`history-risk history-risk--${record.result.risk_level}`}
                                >
                                  {
                                    record.result
                                      .risk_level
                                  }
                                </span>
                              </td>

                              <td>
                                <div className="history-row-actions">
                                  <button
                                    className="history-view-button"
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedRecordId(
                                        record.id,
                                      );
                                    }}
                                  >
                                    View
                                    <ChevronRight
                                      size={13}
                                    />
                                  </button>

                                  <button
                                    className="history-row-delete-button"
                                    type="button"
                                    aria-label="Delete analysis"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeleteOne(
                                        record.id,
                                      );
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <footer className="history-table-footer">
                    <span>
                      Showing {firstVisibleRecord}–
                      {lastVisibleRecord} of{" "}
                      {filteredRecords.length} analyses
                    </span>

                    {totalPages > 1 && (
                      <nav
                        className="history-pagination"
                        aria-label="History pagination"
                      >
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                          onClick={goToPreviousPage}
                        >
                          <ChevronLeft size={14} />
                        </button>

                        <span>
                          Page {currentPage} of{" "}
                          {totalPages}
                        </span>

                        <button
                          type="button"
                          disabled={
                            currentPage === totalPages
                          }
                          aria-label="Next page"
                          onClick={goToNextPage}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </nav>
                    )}
                  </footer>
                </>
              )}
            </div>

            <aside className="history-detail-panel">
              {selectedRecord ? (
                <>
                  <header className="history-detail-header">
                    <div>
                      <h2>Analysis Details</h2>
                      <span>
                        {formatAnalyzedDate(
                          selectedRecord.analyzed_at,
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Close analysis details"
                      onClick={() =>
                        setSelectedRecordId(null)
                      }
                    >
                      <X size={17} />
                    </button>
                  </header>

                  <div className="history-detail-body">
                    <section className="history-detail-overview">
                      <div>
                        <span>Amount</span>
                        <strong>
                          {formatAmount(
                            selectedRecord.request.amount,
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Category</span>
                        <strong>
                          {formatCategory(
                            selectedRecord.request
                              .category,
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>State</span>
                        <strong>
                          {selectedRecord.request.state}
                        </strong>
                      </div>
                    </section>

                    <section className="history-result-card">
                      <div className="history-result-heading">
                        <span
                          className={`history-result-icon history-result-icon--${selectedRecord.result.prediction}`}
                        >
                          {selectedRecord.result
                            .prediction === "fraud" ? (
                            <AlertTriangle
                              size={20}
                            />
                          ) : (
                            <ShieldCheck size={20} />
                          )}
                        </span>

                        <div>
                          <strong>
                            {selectedRecord.result
                              .prediction === "fraud"
                              ? "Fraud"
                              : "Legitimate"}
                          </strong>

                          <span>
                            Needs review:{" "}
                            {selectedRecord.result
                              .needs_review
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                      </div>

                      <dl className="history-model-details">
                        <div>
                          <dt>Model score</dt>
                          <dd>
                            {selectedRecord.result.fraud_score.toFixed(
                              4,
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Decision threshold</dt>
                          <dd>
                            {selectedRecord.result.decision_threshold.toFixed(
                              4,
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Prediction</dt>
                          <dd>
                            {
                              selectedRecord.result
                                .prediction
                            }
                          </dd>
                        </div>

                        <div>
                          <dt>Risk level</dt>
                          <dd>
                            {
                              selectedRecord.result
                                .risk_level
                            }
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="history-location-details">
                      <h3>Transaction context</h3>

                      <div>
                        <CalendarClock size={15} />
                        <span>
                          {formatAnalyzedDate(
                            selectedRecord.request
                              .transaction_datetime,
                          )}
                        </span>
                      </div>

                      <div>
                        <CircleDollarSign size={15} />
                        <span>
                          City population:{" "}
                          {selectedRecord.request.city_population.toLocaleString(
                            "en-US",
                          )}
                        </span>
                      </div>

                      <div>
                        <MapPin size={15} />
                        <span>
                          Customer:{" "}
                          {
                            selectedRecord.request
                              .customer_latitude
                          }
                          ,{" "}
                          {
                            selectedRecord.request
                              .customer_longitude
                          }
                        </span>
                      </div>

                      <div>
                        <MapPin size={15} />
                        <span>
                          Merchant:{" "}
                          {
                            selectedRecord.request
                              .merchant_latitude
                          }
                          ,{" "}
                          {
                            selectedRecord.request
                              .merchant_longitude
                          }
                        </span>
                      </div>
                    </section>

                    <section className="history-factor-section">
                      <h3>Key Risk Factors</h3>

                      {selectedRecord.result.risk_factors
                        .length > 0 ? (
                        <ul>
                          {selectedRecord.result.risk_factors.map(
                            (factor) => (
                              <li key={factor}>
                                <AlertTriangle
                                  size={13}
                                />
                                <span>{factor}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p>
                          No elevated contextual signals
                          were returned.
                        </p>
                      )}
                    </section>
                  </div>

                  <footer className="history-detail-footer">
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteOne(
                          selectedRecord.id,
                        )
                      }
                    >
                      <Trash2 size={14} />
                      Delete analysis
                    </button>
                  </footer>
                </>
              ) : (
                <div className="history-detail-empty">
                  <ShieldCheck size={28} />
                  <h2>Select an analysis</h2>
                  <p>
                    Choose a row to inspect its transaction
                    and model signals.
                  </p>
                </div>
              )}
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}