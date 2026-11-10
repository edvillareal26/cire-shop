"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

import { enterPage } from "@/lib/page-transition/client";

// Layout effect: the new page is hidden before its first paint.
export function PageTransition() {
  const pathname = usePathname();
  useLayoutEffect(() => enterPage(pathname), [pathname]);
  return null;
}
