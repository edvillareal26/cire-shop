import type { Metadata } from "next";
import { ShopListing } from "@/components/shop-listing";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
  description: "Premium lash essentials for a higher standard.",
};

export default async function ShopPage() {
  const products = await getProducts({ first: 100, sortKey: "BEST_SELLING" });
  return <ShopListing title="Shop" activeSlug="" products={products} />;
}
