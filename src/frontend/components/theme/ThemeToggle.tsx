"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="relative inline-flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-slate-300/80 bg-slate-100 p-1 shadow-inner transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500"
    >
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-200 dark:bg-slate-200 ${
          mounted && theme === "dark" ? "translate-x-[2.05rem]" : "translate-x-0"
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <SunIcon active={!mounted || theme === "light"} />
        <MoonIcon active={mounted && theme === "dark"} />
      </span>
    </button>
  );
}

function SunIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-3.5 w-3.5 transition ${
        active ? "text-amber-500" : "text-slate-400 dark:text-slate-500"
      }`}
      aria-hidden
    >
      <path d="M10 3.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.25A.75.75 0 0 1 10 3.5Zm0 11a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM4.25 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm11 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM5.87 5.87a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.87 6.93a.75.75 0 0 1 0-1.06Zm8.2 8.2a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM5.87 14.13a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Zm8.2-8.2a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Z" />
    </svg>
  );
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-3.5 w-3.5 transition ${
        active ? "text-blue-400" : "text-slate-400 dark:text-slate-500"
      }`}
      aria-hidden
    >
      <path d="M10.75 2.5a.75.75 0 0 0-1.5 0v1.04a5.5 5.5 0 1 0 5.96 5.96h1.04a.75.75 0 0 0 0-1.5A7 7 0 1 1 10.75 3.54V2.5Z" />
    </svg>
  );
}
