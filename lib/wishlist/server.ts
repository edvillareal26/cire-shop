import { cookies } from "next/headers";

import { getProductsByIds } from "@/lib/product/server";
import type { ProductCard } from "@/lib/product/types";
import { parseWishlistCookie, WISHLIST_COOKIE } from "@/lib/wishlist";

export async function getWishlistIds(): Promise<string[]> {
  return parseWishlistCookie((await cookies()).get(WISHLIST_COOKIE)?.value);
}

export async function getWishlistProducts(): Promise<ProductCard[]> {
  const ids = await getWishlistIds();
  return ids.length > 0 ? getProductsByIds({ ids }) : [];
}
