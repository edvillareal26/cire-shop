import type { ReactNode } from "react";

export function StorefrontChrome({ children }: { children: ReactNode }) {
  return (
    <div
      className="contents [body:has([data-route-segment=join])_&]:hidden"
      data-slot="storefront-chrome"
    >
      {children}
    </div>
  );
}
