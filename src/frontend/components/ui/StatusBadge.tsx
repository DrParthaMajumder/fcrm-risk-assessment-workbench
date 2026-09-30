type BadgeTone = "blue" | "green" | "yellow" | "red" | "gray";

const toneClasses: Record<BadgeTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function StatusBadge({
  label,
  tone = "gray",
}: {
  label: string;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

export function aiStatusTone(status: string): BadgeTone {
  switch (status) {
    case "ready":
      return "green";
    case "running":
      return "yellow";
    default:
      return "gray";
  }
}

export function reviewStatusTone(status: string): BadgeTone {
  switch (status) {
    case "approved":
      return "green";
    case "deferred":
      return "yellow";
    case "rejected":
      return "red";
    default:
      return "blue";
  }
}

export function formatAiStatus(status: string): string {
  switch (status) {
    case "not_started":
      return "Not started";
    case "running":
      return "Running";
    case "ready":
      return "Ready";
    default:
      return status;
  }
}

export function formatReviewStatus(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "deferred":
      return "Deferred";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}
