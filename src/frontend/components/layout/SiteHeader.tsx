"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/components/layout/nav-links";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-1.5 text-center text-xs font-medium tracking-wide text-slate-300 sm:px-6">
        Internal use only · Synthetic demo data · Human decision required on every case
      </div>

      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white shadow-sm">
            SRW
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              SME Risk Workbench
            </p>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              Underwriting &amp; risk assessment console
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                    : "rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 lg:inline-flex">
            Demo environment
          </span>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-semibold text-white">
              JD
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-none text-slate-900">
                Jane Doe
              </p>
              <p className="mt-1 text-xs text-slate-500">Underwriter</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex gap-1 border-t border-slate-100 px-4 py-2 md:hidden sm:px-6">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "flex-1 rounded-lg bg-blue-50 py-2 text-center text-sm font-medium text-blue-700"
                  : "flex-1 rounded-lg py-2 text-center text-sm font-medium text-slate-600"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
