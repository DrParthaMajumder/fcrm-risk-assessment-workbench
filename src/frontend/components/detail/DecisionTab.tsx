"use client";

import { useMemo, useState } from "react";
import type { Application, Assessment, DecisionChoice } from "@/lib/api/types";
import { submitDecision } from "@/lib/api/client";
import { formatReviewStatus, reviewStatusTone, StatusBadge } from "@/components/ui/StatusBadge";

export function DecisionTab({
  application,
  assessment,
  onSubmitted,
}: {
  application: Application;
  assessment: Assessment | null;
  onSubmitted: (application: Application) => void;
}) {
  const [choice, setChoice] = useState<DecisionChoice>(
    assessment?.recommendation ?? "Defer",
  );
  const [justification, setJustification] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const overridesAi = useMemo(
    () => Boolean(assessment && assessment.recommendation !== choice),
    [assessment, choice],
  );

  const requiresJustification = overridesAi || !assessment;

  async function handleSubmit() {
    if (requiresJustification && !justification.trim()) {
      setError("Justification is required when overriding the AI recommendation.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updated = await submitDecision(application.businessId, {
        choice,
        justification: justification.trim(),
        overridesAi,
      });
      setToast(`Decision recorded: ${choice}.`);
      setConfirmOpen(false);
      onSubmitted(updated);
    } catch {
      setError("Could not submit the decision.");
    } finally {
      setSubmitting(false);
    }
  }

  const isClosed = application.reviewStatus !== "pending";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Human decision panel
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Underwriter must confirm the final decision before the case is closed.
            </p>
          </div>
          <StatusBadge
            label={formatReviewStatus(application.reviewStatus)}
            tone={reviewStatusTone(application.reviewStatus)}
          />
        </div>

        {assessment ? (
          <p className="mt-4 text-sm text-slate-700">
            AI recommendation:{" "}
            <span className="font-semibold">{assessment.recommendation}</span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-amber-800">
            No AI recommendation yet. You may still record a decision with justification.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <fieldset disabled={isClosed} className="space-y-4 disabled:opacity-60">
          <legend className="text-sm font-semibold text-slate-900">
            Final decision
          </legend>

          <div className="flex flex-wrap gap-3">
            {(["Approve", "Defer", "Reject"] as DecisionChoice[]).map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium ${
                  choice === option
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value={option}
                  checked={choice === option}
                  onChange={() => setChoice(option)}
                  className="sr-only"
                />
                {option}
              </label>
            ))}
          </div>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">
              Justification
              {requiresJustification ? " (required)" : ""}
            </span>
            <textarea
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Explain the underwriter rationale, especially if overriding AI."
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {toast ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {toast}
            </p>
          ) : null}

          <button
            type="button"
            disabled={isClosed}
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Submit decision
          </button>
        </fieldset>
      </div>

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-900">Confirm decision</h4>
            <p className="mt-2 text-sm text-slate-600">
              Record <span className="font-medium">{choice}</span> for{" "}
              {application.businessName}?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleSubmit()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
