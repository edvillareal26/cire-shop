"use server";

import { cookies } from "next/headers";
import {
  isProductGid,
  parseWishlist,
  serializeWishlist,
  WISHLIST_COOKIE,
  WISHLIST_COOKIE_OPTIONS,
  WISHLIST_LIMIT,
} from "@/lib/wishlist";

/** Adds the product to the wishlist, or removes it if it's already there. */
export async function toggleWishlist(formData: FormData): Promise<void> {
  const productId = formData.get("productId");
  if (!isProductGid(productId)) return;

  const cookieStore = await cookies();
  const ids = parseWishlist(cookieStore.get(WISHLIST_COOKIE)?.value);
  const next = ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [productId, ...ids].slice(0, WISHLIST_LIMIT);

  // Setting the cookie re-renders the page, so hearts and counts update.
  cookieStore.set(WISHLIST_COOKIE, serializeWishlist(next), WISHLIST_COOKIE_OPTIONS);
}
