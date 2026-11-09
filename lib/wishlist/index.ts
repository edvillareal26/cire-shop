const PRODUCT_GID_PREFIX = "gid://shopify/Product/";

export const WISHLIST_COOKIE = "wishlist";
export const WISHLIST_LIMIT = 50;
export const WISHLIST_PRODUCT_ID = /^gid:\/\/shopify\/Product\/\d+$/;

// Cookie values hold numeric ids joined with "." to stay small and cookie-safe.
export function parseWishlistCookie(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(".")
    .filter((id) => /^\d+$/.test(id))
    .slice(0, WISHLIST_LIMIT)
    .map((id) => `${PRODUCT_GID_PREFIX}${id}`);
}

export function serializeWishlist(productIds: string[]): string {
  return productIds.map((id) => id.slice(PRODUCT_GID_PREFIX.length)).join(".");
}
