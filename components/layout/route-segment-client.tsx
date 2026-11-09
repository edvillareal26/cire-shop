"use client";

import { useSelectedLayoutSegment } from "next/navigation";

// Exposes the top-level route to CSS (`body:has([data-route-segment=…])`) so server-rendered chrome can adapt without re-rendering.
export function RouteSegmentMarker() {
  const segment = useSelectedLayoutSegment();
  return <span data-route-segment={segment ?? "home"} hidden />;
}
