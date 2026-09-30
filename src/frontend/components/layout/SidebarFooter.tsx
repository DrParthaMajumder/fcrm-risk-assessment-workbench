"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ui } from "@/lib/ui/classes";

export function SidebarFooter() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <section className="mt-auto space-y-3 pt-6">
      <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Need help?
        </p>
        <Link
          href="/contact"
          className="mt-1 block text-xs text-blue-600 hover:underline dark:text-blue-400"
        >
          Contact risk ops support →
        </Link>
      </div>

      {isLoaded && isSignedIn ? (
        <SignOutButton>
          <button type="button" className={`w-full ${ui.btnSecondary}`}>
            Log out
          </button>
        </SignOutButton>
      ) : null}
    </section>
  );
}
