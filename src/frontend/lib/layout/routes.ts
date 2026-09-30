export function isWorkbenchRoute(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/applications/");
}

export function applicationIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/applications\/([^/]+)/);
  return match?.[1] ?? null;
}
