import type { ProductRecommendationIntent } from "@shopify/hydrogen/storefront-api-types";
import { cacheLife, cacheTag } from "next/cache";

import type { CommerceLocale } from "@/lib/config/types";
import type { BundleCard, ProductCard, ProductDetails, ProductPage } from "@/lib/product/types";
import { getNumericShopifyId } from "@/lib/shopify/id/server";
import {
  fetchCollectionBundles,
  fetchFirstProductByType,
  fetchProduct,
  fetchProductRecommendations,
  fetchProductsByIds,
  fetchSearchIndexProducts,
} from "@/lib/shopify/operations/products/server";
import type { SearchIndexProductsParams } from "@/lib/shopify/operations/products/types";

// Only valid inside a cache directive scope.
export function tagProducts(products: Array<{ id: string }>): void {
  for (const product of products) {
    const numericId = getNumericShopifyId(product.id);
    if (numericId) cacheTag(`product-${numericId}`);
  }
}

export async function getProduct(params: {
  handle: string;
  locale?: CommerceLocale;
}): Promise<ProductDetails | undefined> {
  "use cache: remote";
  cacheLife("max");
  cacheTag("products", `product-${params.handle}`);

  const product = await fetchProduct(params);
  if (product) tagProducts([product]);
  return product;
}

// Cursor-paginated browse reads stay uncached in lib/collections/server.ts; this serves fixed grids only.
export async function getSearchIndexProducts(
  params: SearchIndexProductsParams,
): Promise<ProductPage> {
  "use cache: remote";
  cacheLife("max");
  cacheTag("products", "products-index");

  const result = await fetchSearchIndexProducts(params);
  tagProducts(result.products);
  return result;
}

export async function getProductRecommendations(params: {
  handle: string;
  intent: ProductRecommendationIntent;
  locale?: CommerceLocale;
}): Promise<ProductCard[]> {
  "use cache: remote";
  cacheLife("max");
  cacheTag("products", `recommendations-${params.handle}`);

  const products = await fetchProductRecommendations(params);
  tagProducts(products);
  return products;
}

export async function getCollectionBundles(params: {
  collectionHandle: string;
  limit: number;
  locale?: CommerceLocale;
}): Promise<BundleCard[]> {
  "use cache: remote";
  cacheLife("max");
  // Creating the collection, changing its products, or adding products all refresh this.
  cacheTag(
    "collections",
    "collections-index",
    `collection-${params.collectionHandle}`,
    "products",
    "products-index",
  );

  const bundles = await fetchCollectionBundles(params);
  tagProducts(bundles);
  return bundles;
}

export async function getFirstProductByType(params: {
  locale?: CommerceLocale;
  productType: string;
}): Promise<ProductCard | undefined> {
  "use cache: remote";
  cacheLife("max");
  // A new or deleted product can change which product comes first.
  cacheTag("products", "products-index");

  const product = await fetchFirstProductByType(params);
  if (product) tagProducts([product]);
  return product;
}

export async function getProductsByIds(params: {
  ids: string[];
  locale?: CommerceLocale;
}): Promise<ProductCard[]> {
  "use cache: remote";
  cacheLife("max");
  cacheTag("products");

  const products = await fetchProductsByIds(params);
  tagProducts(products);
  return products;
}
