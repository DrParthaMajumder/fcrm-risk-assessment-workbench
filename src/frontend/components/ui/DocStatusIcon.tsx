import type { DocAggregateStatus } from "@/lib/api/types";

const config: Record<
  DocAggregateStatus,
  { label: string; className: string; symbol: string }
> = {
  clear: {
    label: "Documents verified",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    symbol: "✓",
  },
  missing: {
    label: "Missing documents",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
    symbol: "!",
  },
  forged: {
    label: "Forged documents",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    symbol: "×",
  },
};

export function DocStatusIcon({ status }: { status: DocAggregateStatus }) {
  const item = config[status];
  return (
    <span
      title={item.label}
      aria-label={item.label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-inset ${item.className}`}
    >
      {item.symbol}
    </span>
  );
}
