export type NavItem = {
  href: string;
  label: string;
  /** Path prefixes that also mark this item as the current page. */
  match?: string[];
};

export const NAV_LEFT: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Shop",
    match: ["/shop", "/products", "/collections", "/search"],
  },
];

export const NAV_RIGHT: NavItem[] = [{ href: "/about", label: "About" }];

/** Prefixes for pages listed under the "Other" menu. */
export const OTHER_MATCH = ["/pages", "/policies"];

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  const prefixes = item.match ?? [item.href];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
