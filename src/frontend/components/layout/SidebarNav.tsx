"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

function linkClass(active: boolean): string {
  return active
    ? "block rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
    : "block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 p-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClass(pathname === link.href)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 md:hidden">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
              : "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
