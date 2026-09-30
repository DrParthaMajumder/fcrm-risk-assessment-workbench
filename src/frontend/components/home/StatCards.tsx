import type { Metrics } from "@/lib/api/types";

const cards = [
  { key: "pendingReview", label: "Pending review", tone: "border-blue-200 bg-blue-50 text-blue-800" },
  { key: "awaitingAi", label: "Awaiting AI input", tone: "border-amber-200 bg-amber-50 text-amber-900" },
  { key: "completed", label: "Completed", tone: "border-emerald-200 bg-emerald-50 text-emerald-800" },
] as const;

export function StatCards({ metrics }: { metrics: Metrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rounded-xl border px-4 py-4 shadow-sm ${card.tone}`}
        >
          <p className="text-sm font-medium">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold">{metrics[card.key]}</p>
        </div>
      ))}
    </div>
  );
}
