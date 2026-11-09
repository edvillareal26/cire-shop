"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Transparent over the page's dark top band; solid once the page scrolls. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="text-cream border-cream/25 sticky top-0 z-40 border-b transition-colors duration-300 data-[scrolled=true]:bg-olive-deep/95 data-[scrolled=true]:backdrop-blur-sm"
    >
      {children}
    </header>
  );
}
