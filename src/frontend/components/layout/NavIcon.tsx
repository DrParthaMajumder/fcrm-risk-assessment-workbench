type NavIconName = "home" | "about" | "contact" | "queue" | "governance";

const paths: Record<NavIconName, string> = {
  home: "M3 9.75 12 3l9 6.75V19.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5V9.75Z",
  about:
    "M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 4.5a1.125 1.125 0 1 1 0 2.25A1.125 1.125 0 0 1 12 7.5Zm-1.125 4.125c0-.621.504-1.125 1.125-1.125s1.125.504 1.125 1.125V15a1.125 1.125 0 1 1-2.25 0v-3.375Z",
  contact:
    "M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Zm3.22 2.47a.75.75 0 0 0-1.06 1.06l5.25 5.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 1 0-1.06-1.06L12 13.44 6.28 9.22Z",
  queue:
    "M4.5 6.75A1.5 1.5 0 0 1 6 5.25h12a1.5 1.5 0 0 1 1.5 1.5v10.5A1.5 1.5 0 0 1 18 18.75H6A1.5 1.5 0 0 1 4.5 17.25V6.75Zm3 3.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1 0-1.5Zm0 3h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5Z",
  governance:
    "M12 2.25l7.5 4.33v8.84L12 19.75l-7.5-4.33V6.58L12 2.25Zm0 3.08L7.5 7.96v5.08L12 16.71l4.5-2.67V7.96L12 5.33Z",
};

export function iconForHref(href: string): NavIconName {
  switch (href) {
    case "/":
      return "home";
    case "/about":
      return "about";
    case "/contact":
      return "contact";
    default:
      return "queue";
  }
}

export function NavIcon({
  name,
  className = "h-4 w-4",
}: {
  name: NavIconName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
