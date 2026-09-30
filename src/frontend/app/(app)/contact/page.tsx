import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { ui } from "@/lib/ui/classes";

const channels = [
  {
    title: "Risk operations",
    detail: "risk-ops@demo-bank.internal",
    note: "Case workflow, policy interpretation, escalation",
  },
  {
    title: "Platform support",
    detail: "workbench-support@demo-bank.internal",
    note: "Access issues, UI bugs, integration questions",
  },
  {
    title: "Hours",
    detail: "Monday – Friday, 9:00–18:00 EST",
    note: "Critical production issues: on-call pager for demo env",
  },
];

export default function ContactPage() {
  return (
    <div className={ui.page}>
      <div className="max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to queue
        </Link>
        <p className={`mt-4 ${ui.subheading}`}>Contact us</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Risk ops & platform support
        </h1>
        <p className={`mt-3 leading-7 ${ui.muted}`}>
          Reach the team responsible for underwriting workflow, governance, and
          workbench operations. All inquiries are logged for audit purposes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {channels.map((channel) => (
            <div key={channel.title} className={`${ui.card} p-5`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {channel.title}
              </p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                {channel.detail}
              </p>
              <p className={`mt-2 text-sm ${ui.muted}`}>{channel.note}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
