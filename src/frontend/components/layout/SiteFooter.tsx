import Link from "next/link";
import { navLinks } from "@/components/layout/nav-links";

const footerSections = [
  {
    title: "Workbench",
    links: [
      { href: "/", label: "Application queue" },
      { href: "/about", label: "About this tool" },
    ],
  },
  {
    title: "Governance",
    links: [
      { href: "/about", label: "Human-in-the-loop policy" },
      { href: "/about", label: "Audit trail standards" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/about", label: "Documentation" },
      { href: "/about", label: "Contact risk ops" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-xs font-bold text-white">
                SRW
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  SME Risk Workbench
                </p>
                <p className="text-xs text-slate-500">v0.1.0 · Hackathon build</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              AI-assisted underwriting console for SME loan review. Recommendations
              are advisory; underwriters retain final authority.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-blue-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SME Risk Workbench. All data is synthetic
            for demonstration purposes.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
            <span>No LLM keys in browser</span>
            <span>Regulatory citations via backend RAG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
