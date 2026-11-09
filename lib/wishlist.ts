import "server-only";

import { cookies } from "next/headers";

// The wishlist lives in a cookie (Shopify has no wishlist API), stored as
// numeric product ids joined with "." to keep it small and cookie-safe.
export const WISHLIST_COOKIE = "wishlist";
export const WISHLIST_LIMIT = 50;

const PRODUCT_GID = "gid://shopify/Product/";

export const WISHLIST_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;

export function isProductGid(value: unknown): value is string {
  return typeof value === "string" && /^gid:\/\/shopify\/Product\/\d+$/.test(value);
}

export function parseWishlist(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(".")
    .filter((id) => /^\d+$/.test(id))
    .slice(0, WISHLIST_LIMIT)
    .map((id) => PRODUCT_GID + id);
}

export function serializeWishlist(ids: string[]): string {
  return ids.map((id) => id.slice(PRODUCT_GID.length)).join(".");
}

/** Product GIDs on the visitor's wishlist, newest first. */
export async function getWishlistIds(): Promise<string[]> {
  return parseWishlist((await cookies()).get(WISHLIST_COOKIE)?.value);
}
