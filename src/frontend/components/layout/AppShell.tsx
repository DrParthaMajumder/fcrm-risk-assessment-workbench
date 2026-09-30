import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Navigation
          </p>
        </div>
        <nav className="p-3">
          <Link
            href="/"
            className="block rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
          >
            Home
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Internal workbench
              </p>
              <h1 className="text-xl font-semibold text-slate-900">
                SME Risk Workbench
              </h1>
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Jane Doe</span>
              <span className="text-slate-400"> · </span>
              Underwriter
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
