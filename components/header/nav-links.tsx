"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, type NavItem } from "@/lib/navigation";

export const navLinkClass =
  "font-serif text-sm uppercase tracking-[0.26em] text-cream/85 transition-colors hover:text-cream decoration-1 underline-offset-[7px]";

/** Nav link that underlines itself on the current page. */
export function NavLink({ item }: { item: NavItem }) {
  // usePathname can suspend while prerendering product pages, so callers
  // wrap this in <Suspense> with <StaticNavLink> as the fallback.
  const active = isActive(usePathname(), item);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${navLinkClass} ${active ? "text-cream underline" : ""}`}
    >
      {item.label}
    </Link>
  );
}

export function StaticNavLink({ item }: { item: NavItem }) {
  return (
    <Link href={item.href} className={navLinkClass}>
      {item.label}
    </Link>
  );
}
