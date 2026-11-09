import type { ProductCard, ProductSortKey } from "@/lib/shopify/types";

export type ShopView = {
  slug: string;
  title: string;
  sortKey: ProductSortKey;
  reverse?: boolean;
  /** Only products whose Shopify "Product type" matches exactly. */
  productType?: string;
  /** Only products with a compare-at price above their price. */
  onSale?: boolean;
  emptyMessage?: string;
};

// Category pages, keyed to each product's type in Shopify admin. If a product
// type is renamed in Shopify, update it here too.
export const CATEGORIES: ShopView[] = [
  { slug: "eyelash-trays", title: "Eyelash Trays", productType: "Lash Extensions", sortKey: "BEST_SELLING" },
  { slug: "adhesives", title: "Adhesives", productType: "Lash Adhesives", sortKey: "BEST_SELLING" },
  { slug: "bonders", title: "Bonders", productType: "Lash Bonder", sortKey: "BEST_SELLING" },
  { slug: "primers", title: "Primers", productType: "Lash Primer", sortKey: "BEST_SELLING" },
];

export const SHOP_VIEWS: ShopView[] = [
  { slug: "new-arrivals", title: "New Arrivals", sortKey: "CREATED_AT", reverse: true },
  { slug: "best-sellers", title: "Best Sellers", sortKey: "BEST_SELLING" },
  {
    slug: "sale",
    title: "Sale",
    sortKey: "BEST_SELLING",
    onSale: true,
    emptyMessage: "Nothing is on sale right now. Check back soon.",
  },
  ...CATEGORIES,
];

export function findShopView(slug: string): ShopView | undefined {
  return SHOP_VIEWS.find((v) => v.slug === slug);
}

export function isOnSale(product: ProductCard): boolean {
  return (
    Number(product.compareAtPriceRange.maxVariantPrice.amount) >
    Number(product.priceRange.minVariantPrice.amount)
  );
}

export function filterForView(view: ShopView, products: ProductCard[]) {
  return products.filter(
    (p) =>
      (!view.productType || p.productType === view.productType) &&
      (!view.onSale || isOnSale(p)),
  );
}
