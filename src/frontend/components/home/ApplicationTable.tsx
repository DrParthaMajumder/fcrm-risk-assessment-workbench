"use client";

import { useRouter } from "next/navigation";
import type { Application } from "@/lib/api/types";
import { DocStatusIcon } from "@/components/ui/DocStatusIcon";
import {
  StatusBadge,
  aiStatusTone,
  formatAiStatus,
  formatReviewStatus,
  reviewStatusTone,
} from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils/format";
import { getDocAggregateStatus } from "@/lib/utils/documents";

export function ApplicationTable({ items }: { items: Application[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
        No applications match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">App ID</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Credit</th>
              <th className="px-4 py-3">Docs</th>
              <th className="px-4 py-3">AI status</th>
              <th className="px-4 py-3">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((application) => (
              <tr
                key={application.businessId}
                onClick={() => router.push(`/applications/${application.businessId}`)}
                className="cursor-pointer transition hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {application.businessId}
                </td>
                <td className="px-4 py-3 text-slate-700">{application.businessName}</td>
                <td className="px-4 py-3 text-slate-700">{application.industry}</td>
                <td className="px-4 py-3 text-slate-700">
                  {formatCurrency(application.loanAmountRequested)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {application.ownerCreditScore}
                </td>
                <td className="px-4 py-3">
                  <DocStatusIcon
                    status={getDocAggregateStatus(
                      application.documents,
                      application.documentVerification,
                    )}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={formatAiStatus(application.aiStatus)}
                    tone={aiStatusTone(application.aiStatus)}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={formatReviewStatus(application.reviewStatus)}
                    tone={reviewStatusTone(application.reviewStatus)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
