import Link from "next/link";

const principles = [
  {
    title: "Humans decide",
    body: "AI prepares recommendations and citations. Underwriters record the final Approve, Defer, or Reject decision.",
  },
  {
    title: "Evidence first",
    body: "Every case shows document verification status and policy citations before it can be closed.",
  },
  {
    title: "Audit ready",
    body: "Assessment runs, chat questions, and human decisions are logged for examiner review.",
  },
];

const team = [
  { name: "Jane Doe", role: "Lead Underwriter", focus: "Case review and final decisions" },
  { name: "Alex Chen", role: "Risk Analyst", focus: "Policy mapping and assessment QA" },
  { name: "Sam Rivera", role: "Platform Engineer", focus: "Workbench integration and data pipeline" },
];

export default function AboutPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          About this workbench
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          SME Risk Workbench
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          An internal tool for SME loan underwriting. Analysts queue applications,
          inspect document evidence, review AI-generated recommendations, and
          record governed human decisions. Built for the Myridius Genius Hacks 2026
          Risk Assessment challenge using synthetic data only.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to application queue
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {principles.map((item) => (
          <section
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </section>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Team
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-lg border border-slate-200 px-4 py-4"
            >
              <p className="font-medium text-slate-900">{member.name}</p>
              <p className="mt-1 text-sm text-blue-700">{member.role}</p>
              <p className="mt-2 text-sm text-slate-600">{member.focus}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Data & compliance notes
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>Synthetic SME loan dataset — no real customer or regulator data.</li>
          <li>Policy citations are retrieved server-side; no LLM keys in the browser.</li>
          <li>AI output is labeled as a recommendation, not a final approval.</li>
        </ul>
      </section>
    </div>
  );
}
