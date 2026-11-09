"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { NAV_LEFT, NAV_RIGHT } from "@/lib/navigation";
import type { OtherLink } from "@/lib/content";

export function MobileMenu({
  otherLinks,
  accountUrl,
}: {
  otherLinks: OtherLink[];
  accountUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);
  const primary = [...NAV_LEFT, ...NAV_RIGHT];
  const secondary = [
    { href: "/search", label: "Search" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-ml-1 p-1 lg:hidden"
      >
        <MenuIcon className="size-6" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-olive-deep text-cream fixed inset-0 z-50 flex flex-col overflow-y-auto lg:hidden"
        >
          <div className="border-cream/25 grid h-(--header-h) shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b px-5">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="-ml-1 justify-self-start p-1"
            >
              <CloseIcon className="size-6" />
            </button>
            <Link href="/" onNavigate={close}>
              <Logo className="h-[52px]" />
            </Link>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col gap-10 px-8 py-10">
            <ul className="space-y-4">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onNavigate={close}
                    className="font-serif text-4xl font-light italic"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {otherLinks.length > 0 ? (
              <div>
                <p className="text-cream/60 mb-3 font-sans text-[11px] tracking-[0.28em] uppercase">
                  Other
                </p>
                <ul className="space-y-2">
                  {otherLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} onNavigate={close} className="font-serif text-xl">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ul className="border-cream/20 mt-auto space-y-3 border-t pt-6 font-sans text-xs tracking-[0.2em] uppercase">
              {secondary.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onNavigate={close}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {accountUrl ? (
                <li>
                  <a href={accountUrl}>Account</a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
