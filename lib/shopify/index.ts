import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  COLLECTION_QUERY,
  COLLECTIONS_QUERY,
  PAGE_QUERY,
  PAGES_QUERY,
  POLICIES_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_BY_IDS_QUERY,
  PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  SHOP_QUERY,
} from "./queries";
import type {
  Cart,
  CartLineInput,
  CartLineUpdateInput,
  Collection,
  CollectionSummary,
  Page,
  PageSummary,
  Policy,
  Product,
  ProductCard,
  ProductSortKey,
  Shop,
  UserError,
} from "./types";

export type * from "./types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
export const apiVersion =
  process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || "2026-10";

/**
 * When no store is configured we fall back to mock.shop, Shopify's public
 * demo Storefront API, so the site runs end to end before credentials exist.
 */
export const isDemoStore = !storeDomain;

const endpoint = storeDomain
  ? `https://${storeDomain}/api/${apiVersion}/graphql.json`
  : "https://mock.shop/api";

/** Shopify-hosted customer account (sign in, orders, addresses). */
export const accountUrl = storeDomain ? `https://${storeDomain}/account` : null;

/** Cache tags used by `cacheTag` and the Shopify webhook revalidation route. */
export const TAGS = {
  shop: "shopify:shop",
  products: "shopify:products",
  collections: "shopify:collections",
  content: "shopify:content",
} as const;

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

export class ShopifyUserError extends Error {
  constructor(errors: UserError[]) {
    super(errors.map((e) => e.message).join(" "));
    this.name = "ShopifyUserError";
  }
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (accessToken) headers["X-Shopify-Storefront-Access-Token"] = accessToken;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(
      `Shopify Storefront API responded ${res.status} ${res.statusText}`,
    );
  }

  const body = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (body.errors?.length) {
    throw new Error(
      `Shopify Storefront API error: ${body.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!body.data) throw new Error("Shopify Storefront API returned no data");

  return body.data;
}

// ---------------------------------------------------------------------------
// Catalog (cached — part of the static shell, refreshed hourly or by webhook)
// ---------------------------------------------------------------------------

export async function getShop(): Promise<Shop> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.shop);

  const data = await shopifyFetch<{ shop: Shop }>(SHOP_QUERY);
  return data.shop;
}

export async function getProducts({
  first = 100,
  sortKey = "BEST_SELLING",
  reverse = false,
}: {
  first?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
} = {}): Promise<ProductCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products);

  const data = await shopifyFetch<{ products: { nodes: ProductCard[] } }>(
    PRODUCTS_QUERY,
    { first, sortKey, reverse },
  );
  return data.products.nodes;
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products);

  const data = await shopifyFetch<{ product: Product | null }>(PRODUCT_QUERY, {
    handle,
  });
  return data.product;
}

export async function getCollections(): Promise<CollectionSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.collections);

  const data = await shopifyFetch<{
    collections: { nodes: CollectionSummary[] };
  }>(COLLECTIONS_QUERY, { first: 50 });
  return data.collections.nodes;
}

export async function getCollection(
  handle: string,
): Promise<Collection | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.collections, TAGS.products);

  const data = await shopifyFetch<{ collection: Collection | null }>(
    COLLECTION_QUERY,
    { handle, first: 100 },
  );
  return data.collection;
}

export async function searchProducts(query: string): Promise<ProductCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products);

  const data = await shopifyFetch<{
    search: { nodes: (ProductCard | Record<string, never>)[] };
  }>(SEARCH_PRODUCTS_QUERY, { query, first: 50 });
  return data.search.nodes.filter((n): n is ProductCard => "id" in n);
}

/** Products in the order of `ids`; ids that no longer exist are skipped. */
export async function getProductsByIds(ids: string[]): Promise<ProductCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products);

  if (ids.length === 0) return [];
  const data = await shopifyFetch<{ nodes: (ProductCard | null)[] }>(
    PRODUCTS_BY_IDS_QUERY,
    { ids },
  );
  return data.nodes.filter((n): n is ProductCard => !!n && "id" in n);
}

// ---------------------------------------------------------------------------
// Content (Online Store pages and policies, edited in Shopify admin)
// ---------------------------------------------------------------------------

export async function getPages(): Promise<PageSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.content);

  const data = await shopifyFetch<{ pages: { nodes: PageSummary[] } }>(
    PAGES_QUERY,
    { first: 50 },
  );
  return data.pages.nodes;
}

export async function getPage(handle: string): Promise<Page | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.content);

  const data = await shopifyFetch<{ page: Page | null }>(PAGE_QUERY, {
    handle,
  });
  return data.page;
}

export async function getPolicies(): Promise<Policy[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.content);

  const data = await shopifyFetch<{
    shop: Record<string, Policy | null>;
  }>(POLICIES_QUERY);
  return Object.values(data.shop).filter((p): p is Policy => !!p);
}

// ---------------------------------------------------------------------------
// Cart (never cached — per-visitor and always fresh)
// ---------------------------------------------------------------------------

type CartMutationResult = { cart: Cart | null; userErrors: UserError[] };

function unwrapCart(result: CartMutationResult): Cart {
  if (result.userErrors.length) throw new ShopifyUserError(result.userErrors);
  if (!result.cart) throw new Error("Shopify did not return a cart");
  return result.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  // A cart that has expired or been checked out comes back as null.
  const data = await shopifyFetch<{ cart: Cart | null }>(CART_QUERY, {
    cartId,
  });
  return data.cart;
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartMutationResult }>(
    CART_CREATE_MUTATION,
    { lines },
  );
  return unwrapCart(data.cartCreate);
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResult }>(
    CART_LINES_ADD_MUTATION,
    { cartId, lines },
  );
  return unwrapCart(data.cartLinesAdd);
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResult }>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines },
  );
  return unwrapCart(data.cartLinesUpdate);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResult }>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds },
  );
  return unwrapCart(data.cartLinesRemove);
}
