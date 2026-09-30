"use client";

import { useEffect, useMemo, useState } from "react";
import { getApplications, getMetrics } from "@/lib/api/client";
import type {
  Application,
  Metrics,
  ReviewStatus,
  StageFilter,
} from "@/lib/api/types";
import { ApplicationTable } from "@/components/home/ApplicationTable";
import { NewApplicationModal } from "@/components/home/NewApplicationModal";
import { StatCards } from "@/components/home/StatCards";

const PAGE_SIZE = 20;

export function WorkbenchHome() {
  const [metrics, setMetrics] = useState<Metrics>({
    pendingReview: 0,
    awaitingAi: 0,
    completed: 0,
  });
  const [items, setItems] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<StageFilter>("all");
  const [docStatus, setDocStatus] = useState<"all" | "clear" | "missing" | "forged">(
    "all",
  );
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [metricsResult, listResult] = await Promise.all([
          getMetrics(),
          getApplications({
            page,
            limit: PAGE_SIZE,
            search,
            stage,
            docStatus,
            reviewStatus,
          }),
        ]);

        if (cancelled) return;

        setMetrics(metricsResult);
        setItems(listResult.items);
        setTotal(listResult.total);
        setUsingDemoData(true);
      } catch {
        if (!cancelled) {
          setError("Could not load applications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, search, stage, docStatus, reviewStatus]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {usingDemoData ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing demo data from the local mock layer until the FastAPI backend is available.
        </div>
      ) : null}

      <StatCards metrics={metrics} />

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + New application
            </button>
            <input
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by App ID or company"
              className="min-w-[220px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={stage}
              onChange={(event) => {
                setPage(1);
                setStage(event.target.value as StageFilter);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All stages</option>
              <option value="awaiting_ai">Awaiting AI input</option>
              <option value="pending_review">Pending review</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={docStatus}
              onChange={(event) => {
                setPage(1);
                setDocStatus(event.target.value as typeof docStatus);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All doc status</option>
              <option value="clear">Verified</option>
              <option value="missing">Missing</option>
              <option value="forged">Forged</option>
            </select>

            <select
              value={reviewStatus}
              onChange={(event) => {
                setPage(1);
                setReviewStatus(event.target.value as ReviewStatus | "all");
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All review status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="deferred">Deferred</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Loading applications...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-12 text-center text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <ApplicationTable items={items} />
      )}

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
        <p className="text-slate-600">
          Page {page} of {totalPages} · {total.toLocaleString()} total applications
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <NewApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
