import "server-only";

import { getPages, getPolicies } from "@/lib/shopify";

export type OtherLink = { href: string; label: string };

/** Shopify pages (Online Store → Pages) and policies, shown under "Other". */
export async function getOtherLinks(): Promise<OtherLink[]> {
  const [pages, policies] = await Promise.all([getPages(), getPolicies()]);
  return [
    ...pages
      .filter((p) => p.handle !== "about") // About has its own nav item
      .map((p) => ({ href: `/pages/${p.handle}`, label: p.title })),
    ...policies.map((p) => ({ href: `/policies/${p.handle}`, label: p.title })),
  ];
}
