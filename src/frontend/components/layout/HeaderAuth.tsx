"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function HeaderAuth() {
  const { user } = useUser();
  const displayName =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Signed in user";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 lg:inline-flex">
        Demo environment
      </span>

      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign in
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="hidden items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <div className="text-left">
            <p className="max-w-[180px] truncate text-sm font-medium leading-none text-slate-900">
              {displayName}
            </p>
            <p className="mt-1 text-xs text-slate-500">Underwriter</p>
          </div>
        </div>
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
