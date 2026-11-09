import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopListing } from "@/components/shop-listing";
import { filterForView, findShopView, SHOP_VIEWS } from "@/lib/shop-views";
import { getProducts } from "@/lib/shopify";

// New Arrivals, Best Sellers, Sale and the product categories (lib/shop-views.ts).
export function generateStaticParams() {
  return SHOP_VIEWS.map((view) => ({ slug: view.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const view = findShopView((await params).slug);
  return { title: view?.title ?? "Shop" };
}

export default async function ShopViewPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const view = findShopView(slug);
  if (!view) notFound();

  const products = await getProducts({
    first: 100,
    sortKey: view.sortKey,
    reverse: view.reverse,
  });

  return (
    <ShopListing
      title={view.title}
      activeSlug={view.slug}
      products={filterForView(view, products)}
      emptyMessage={view.emptyMessage}
    />
  );
}
