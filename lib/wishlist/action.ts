"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  parseWishlistCookie,
  serializeWishlist,
  WISHLIST_COOKIE,
  WISHLIST_LIMIT,
  WISHLIST_PRODUCT_ID,
} from "@/lib/wishlist";

const TOGGLE_INPUT = z.strictObject({ productId: z.string().regex(WISHLIST_PRODUCT_ID) });

export async function toggleWishlistAction(productId: string): Promise<boolean | null> {
  const parsed = TOGGLE_INPUT.safeParse({ productId });
  if (!parsed.success) return null;
  const id = parsed.data.productId;

  const cookieStore = await cookies();
  const ids = parseWishlistCookie(cookieStore.get(WISHLIST_COOKIE)?.value);
  const saved = !ids.includes(id);
  const next = saved ? [id, ...ids].slice(0, WISHLIST_LIMIT) : ids.filter((item) => item !== id);

  cookieStore.set(WISHLIST_COOKIE, serializeWishlist(next), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return saved;
}
