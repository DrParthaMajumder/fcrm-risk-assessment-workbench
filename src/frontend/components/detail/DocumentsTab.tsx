import type { Application } from "@/lib/api/types";
import { DOCUMENT_FIELDS } from "@/lib/api/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPercent } from "@/lib/utils/format";
import { docCellTone, formatDocumentLabel } from "@/lib/utils/documents";

function docBadgeTone(value: string) {
  const tone = docCellTone(value as Application["documents"][keyof Application["documents"]]);
  switch (tone) {
    case "green":
      return "green";
    case "yellow":
      return "yellow";
    case "red":
      return "red";
    default:
      return "gray";
  }
}

export function DocumentsTab({ application }: { application: Application }) {
  const hasIssue =
    application.documentVerification === "Forged_Documents" ||
    application.documentVerification === "Missing_Critical_Docs";

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl border px-5 py-4 ${
          hasIssue
            ? "border-rose-200 bg-rose-50 text-rose-900"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Document completeness</p>
            <p className="text-2xl font-semibold">
              {formatPercent(application.completenessScore, 0)}
            </p>
          </div>
          <p className="text-sm">
            Verification status:{" "}
            <span className="font-medium">
              {application.documentVerification.replaceAll("_", " ")}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DOCUMENT_FIELDS.map((field) => {
          const value = application.documents[field];
          return (
            <div
              key={field}
              className={`rounded-xl border bg-white p-4 shadow-sm ${
                value === "Forged" || value === "Missing"
                  ? "border-amber-200"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">
                  {formatDocumentLabel(field)}
                </p>
                <StatusBadge
                  label={value.replaceAll("_", " ")}
                  tone={docBadgeTone(value)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
