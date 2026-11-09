import { serializeCollectionParams } from "@shopify/hydrogen";

import type { Filter } from "@/lib/filters/types";

export interface Category {
  /** The Shopify product type this category filters by. */
  productType: string;
  title: string;
}

/**
 * Shop categories, in display order. Each one is a Shopify product type, so a new product joins
 * its category by its Product type in Shopify admin; no collections are needed.
 */
export const CATEGORIES: readonly Category[] = [
  { productType: "Lash Extensions", title: "Lashes" },
  { productType: "Lash Adhesives", title: "Adhesives" },
  { productType: "Lash Bonder", title: "Bonders" },
  { productType: "Lash Primer", title: "Primers" },
];

const SHOP_PATH = "/collections/all";

/** The shop page with this category's filter selected. */
export function getCategoryHref(category: Category): string {
  const search = serializeCollectionParams({
    filters: [{ productType: category.productType }],
    reverse: false,
    sortKey: undefined,
  });
  return `${SHOP_PATH}?${search}`;
}

export function findCategory(productType: string | null | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.productType === productType);
}

/**
 * The categories as a "Product Type" group for the shop page's filter panel. Shopify only returns
 * facets a store enables in Search & Discovery, so this one is built here and has no counts.
 */
export function getProductTypeFilter(): Filter {
  return {
    id: "filter.p.product_type",
    label: "Product Type",
    paramKey: "filter.p.product_type",
    presentation: "text",
    type: "list",
    values: CATEGORIES.map((category) => ({
      id: `filter.p.product_type.${category.productType}`,
      input: JSON.stringify({ productType: category.productType }),
      label: category.title,
      value: category.productType,
    })),
  };
}
