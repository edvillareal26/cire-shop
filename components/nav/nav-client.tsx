"use client";

import { cn } from "cn";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { Link } from "@/components/ui/link";
import type { MenuItem } from "@/lib/menu/types";

const LINK_CLASS =
  "font-serif text-sm uppercase tracking-[0.26em] text-cream/85 decoration-1 underline-offset-[7px] transition-colors hover:text-cream data-[active=true]:font-semibold data-[active=true]:text-cream data-[active=true]:underline";

export interface NavLinkItem {
  href: string;
  label: string;
  match?: string[];
}

function isActive(pathname: string, item: NavLinkItem): boolean {
  if (item.href === "/") return pathname === "/";
  return (item.match ?? [item.href]).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav
      className="sticky top-0 z-30 w-full border-b border-cream/25 bg-olive/95 pt-[env(safe-area-inset-top,0px)] text-cream backdrop-blur-sm transition-colors duration-300 [body:has([data-route-segment=home])_&:not([data-scrolled=true])]:bg-transparent [body:has([data-route-segment=home])_&:not([data-scrolled=true])]:backdrop-blur-none"
      data-scrolled={scrolled}
      id="nav-outer"
    >
      {children}
    </nav>
  );
}

export function NavLink({ item }: { item: NavLinkItem }) {
  const active = isActive(usePathname(), item);
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={LINK_CLASS}
      data-active={active}
      href={item.href}
    >
      {item.label}
    </Link>
  );
}

export function StaticNavLink({ item }: { item: NavLinkItem }) {
  return (
    <Link className={LINK_CLASS} href={item.href}>
      {item.label}
    </Link>
  );
}

const OTHER_PREFIXES = ["/pages/", "/policies/"];

export function OtherMenu({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = OTHER_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        className={cn(LINK_CLASS, "cursor-pointer", open && "text-cream")}
        data-active={active}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Other
      </button>
      {open && (
        <ul
          className="absolute top-full left-1/2 mt-6 min-w-60 -translate-x-1/2 border border-cream/20 bg-olive-deep py-3 shadow-xl"
          id={menuId}
        >
          {items.map((item) => (
            <li key={item.id}>
              <Link
                aria-current={pathname === item.url ? "page" : undefined}
                className="block px-6 py-2.5 font-serif text-lg text-cream/85 hover:bg-cream/5 hover:text-cream aria-[current=page]:underline"
                href={item.url}
                onNavigate={() => setOpen(false)}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StaticOtherMenu() {
  return <span className={LINK_CLASS}>Other</span>;
}
