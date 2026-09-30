import type { AuditEvent } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/format";

export function AuditTab({
  events,
  loading,
}: {
  events: AuditEvent[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Loading audit trail...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li
          key={event.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{event.type}</p>
            <p className="text-xs text-slate-500">{formatDateTime(event.at)}</p>
          </div>
          <p className="mt-2 text-sm text-slate-700">{event.summary}</p>
        </li>
      ))}
    </ol>
  );
}
