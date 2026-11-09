"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { OTHER_MATCH } from "@/lib/navigation";
import { navLinkClass } from "./nav-links";

import type { OtherLink } from "@/lib/content";

export function OtherMenu({ links }: { links: OtherLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = OTHER_MATCH.some((p) => pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (links.length === 0) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`${navLinkClass} ${active || open ? "text-cream" : ""} ${active ? "underline" : ""}`}
      >
        Other
      </button>
      {open ? (
        <ul
          id={menuId}
          className="bg-olive-deep border-cream/20 absolute top-full left-1/2 mt-6 min-w-60 -translate-x-1/2 border py-3 shadow-xl"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onNavigate={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className="text-cream/85 hover:text-cream hover:bg-cream/5 block px-6 py-2.5 font-serif text-lg aria-[current=page]:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function StaticOtherMenu() {
  return (
    <span className={navLinkClass}>Other</span>
  );
}
