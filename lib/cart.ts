import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { getCart, type Cart } from "@/lib/shopify";

export const CART_COOKIE = "shopify_cart_id";

export const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as const;

export async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

/** Fetches a cart once per render, even if several components ask for it. */
export const getCartById = cache(getCart);

/** The visitor's cart, or null if they don't have one yet (or it has expired). */
export async function readCart(): Promise<Cart | null> {
  const cartId = await getCartId();
  return cartId ? getCartById(cartId) : null;
}
