import type { Application, Assessment } from "@/lib/api/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AssessmentTab({
  application,
  assessment,
  loading,
  onRun,
}: {
  application: Application;
  assessment: Assessment | null;
  loading: boolean;
  onRun: () => void;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Running AI assessment...
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm text-slate-600">
          No AI assessment yet for {application.businessName}.
        </p>
        <button
          type="button"
          onClick={onRun}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Run AI Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          AI recommendation
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold text-blue-950">
            AI recommendation: {assessment.recommendation}
          </p>
          <StatusBadge label={assessment.riskBand} tone="yellow" />
          <StatusBadge label={`Score ${assessment.score}`} tone="blue" />
        </div>
        <p className="mt-2 text-sm text-blue-900">
          This is a recommendation only. The underwriter must confirm the final decision.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Risk factors
        </h3>
        <ul className="mt-4 space-y-3">
          {assessment.factors.map((factor) => (
            <li
              key={factor.name}
              className="rounded-lg border border-slate-200 px-4 py-3"
            >
              <p className="text-sm font-medium text-slate-900">{factor.name}</p>
              <p className="mt-1 text-sm text-slate-600">{factor.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
