/** Shared Tailwind class strings for a consistent enterprise UI. */
export const ui = {
  page: "mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8",
  surface:
    "bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100",
  card:
    "rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none",
  cardInset:
    "rounded-lg border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/60",
  divider: "border-slate-200/80 dark:border-slate-800",
  muted: "text-sm text-slate-500 dark:text-slate-400",
  heading: "text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50",
  subheading:
    "text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400",
  input:
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500",
  select:
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-none",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  tableWrap: "overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90",
  tableHead:
    "bg-slate-50/90 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-900 dark:text-slate-400",
  tableRow:
    "cursor-pointer border-t border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/50",
  alertInfo:
    "rounded-xl border border-blue-200/80 bg-blue-50/80 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100",
  alertWarn:
    "rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100",
} as const;
