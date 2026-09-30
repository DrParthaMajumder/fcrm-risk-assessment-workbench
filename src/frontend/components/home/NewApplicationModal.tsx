"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createApplication } from "@/lib/api/client";

interface NewApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewApplicationModal({ open, onClose }: NewApplicationModalProps) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [loanAmountRequested, setLoanAmountRequested] = useState("250000");
  const [loanPurpose, setLoanPurpose] = useState("Working Capital");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const application = await createApplication({
        businessName,
        industry,
        loanAmountRequested: Number(loanAmountRequested),
        loanPurpose,
      });
      onClose();
      router.push(`/applications/${application.businessId}`);
    } catch {
      setError("Could not create the application. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              New application
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Creates a new case in the workbench queue.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Business name</span>
            <input
              required
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Acme Manufacturing LLC"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Industry</span>
            <select
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {[
                "Technology",
                "Healthcare",
                "Manufacturing",
                "Construction",
                "Hospitality",
                "Retail",
                "Logistics",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Loan amount requested</span>
            <input
              required
              type="number"
              min={1000}
              value={loanAmountRequested}
              onChange={(event) => setLoanAmountRequested(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Loan purpose</span>
            <input
              required
              value={loanPurpose}
              onChange={(event) => setLoanPurpose(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
