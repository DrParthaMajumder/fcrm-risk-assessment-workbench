import type { PolicyCitation } from "@/lib/api/types";

export function PolicyTab({
  citations,
  loading,
  onFindPolicy,
}: {
  citations: PolicyCitation[];
  loading: boolean;
  onFindPolicy: () => void;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Retrieving policy citations...
      </div>
    );
  }

  if (citations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm text-slate-600">
          No policy citations yet. Run an assessment to retrieve relevant regulatory passages.
        </p>
        <button
          type="button"
          onClick={onFindPolicy}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Find relevant policy
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {citations.map((citation) => (
        <article
          key={citation.id}
          id={citation.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {citation.documentName}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Relevance {(citation.relevance * 100).toFixed(0)}%
            </span>
          </div>
          <blockquote className="mt-3 border-l-4 border-blue-200 pl-4 text-sm italic text-slate-700">
            “{citation.quotedSpan}”
          </blockquote>
        </article>
      ))}
    </div>
  );
}
