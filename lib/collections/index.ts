import {
  type CollectionState,
  getSortByValue,
  parseCollectionParams,
  type ProductFilter,
  serializeCollectionParams,
} from "@shopify/hydrogen";

import type { BrowseState, Collection, SortValue } from "@/lib/collections/types";
import { shopConfig } from "@/lib/config";
import { summarizeText } from "@/lib/content";

// The shop page is a local virtual collection with no Storefront API equivalent; it replaces the theme's /collections/all.
export const ALL_PRODUCTS_HANDLE = "all";
export const ALL_PRODUCTS_PATH = "/shop";

export const PRODUCTS_PER_PAGE = 40;

export function describeCollection(collection: Collection): string {
  return (
    summarizeText(collection.seo.description) ||
    summarizeText(collection.description) ||
    `Shop ${collection.title} at ${shopConfig.site.name}: browse products, compare prices, and check availability.`
  );
}

// Shopify `sort_by` values; "manual" means the collection's own order.
export const SORT_VALUES = [
  "manual",
  "best-selling",
  "title-ascending",
  "title-descending",
  "price-ascending",
  "price-descending",
  "created-ascending",
  "created-descending",
] as const;

// Storefront `search` only sorts by RELEVANCE and PRICE.
export const SEARCH_SORT_EXCLUDE: SortValue[] = [
  "best-selling",
  "created-ascending",
  "created-descending",
  "title-ascending",
  "title-descending",
];

export function getBrowseSort(
  state: Pick<CollectionState, "reverse" | "sortKey">,
): string | undefined {
  return state.sortKey ? getSortByValue(state.sortKey, state.reverse) : undefined;
}

export function resolveBrowseParams(search: string | URLSearchParams): BrowseState {
  const state = parseCollectionParams(
    typeof search === "string" ? new URLSearchParams(search) : search,
  );
  return {
    dataSearch: serializeCollectionParams(state).toString(),
    filters: state.filters,
    sort: getBrowseSort(state),
  };
}

const BROWSE_PATH = new RegExp(`^(${ALL_PRODUCTS_PATH}|/collections/[^/]+)/?$`);
const REFINED_COLLECTION_PATH = new RegExp(
  `^(?:${ALL_PRODUCTS_PATH}|/collections/[^/]+)/refine/?$`,
);

// The default view never reads search params so its products stay in the static shell and prefetches; filtered and sorted views render from the request-time `refine` route.
export function getRefinedCollectionPath(pathname: string, search: string): string | null {
  const path = BROWSE_PATH.exec(pathname)?.[1];
  return path && resolveBrowseParams(search).dataSearch ? `${path}/refine` : null;
}

export function isRefinedCollectionPath(pathname: string): boolean {
  return REFINED_COLLECTION_PATH.test(pathname);
}

export function getBrowseSearch(
  state: Pick<CollectionState, "filters" | "reverse" | "sortKey">,
): string {
  return serializeCollectionParams(state).toString();
}

export function parseFilterInput(input: string): ProductFilter | undefined {
  try {
    return JSON.parse(input) as ProductFilter;
  } catch {
    return undefined;
  }
}
