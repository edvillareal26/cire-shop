import Link from "next/link";
import { Container, PageHero } from "@/components/container";
import { ProductGrid } from "@/components/product-grid";
import { CATEGORIES } from "@/lib/shop-views";
import type { ProductCard } from "@/lib/shopify/types";

const tabs = [{ slug: "", title: "All" }, ...CATEGORIES];

/** Shared layout for /shop and /shop/[slug]: title band, category tabs, grid. */
export function ShopListing({
  title,
  activeSlug,
  products,
  emptyMessage = "No products here yet.",
}: {
  title: string;
  /** Slug of the current view ("" for all products). */
  activeSlug: string;
  products: ProductCard[];
  emptyMessage?: string;
}) {
  return (
    <>
      <PageHero eyebrow="The Collection" title={title}>
        <p className="text-cream/75 mt-4 max-w-md font-serif text-lg tracking-[0.12em] uppercase">
          Premium lash essentials for a higher standard
        </p>
      </PageHero>
      <Container className="py-14 sm:py-20">
        <div className="border-border mb-12 flex flex-wrap items-center justify-between gap-6 border-b pb-6">
          <nav aria-label="Categories" className="flex flex-wrap gap-x-7 gap-y-3">
            {tabs.map((tab) => {
              const active = tab.slug === activeSlug;
              return (
                <Link
                  key={tab.slug}
                  href={tab.slug ? `/shop/${tab.slug}` : "/shop"}
                  aria-current={active ? "page" : undefined}
                  className={`font-sans text-xs tracking-[0.2em] uppercase decoration-1 underline-offset-[6px] ${
                    active ? "text-foreground underline" : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab.title}
                </Link>
              );
            })}
          </nav>
          <p className="text-muted font-sans text-xs tracking-[0.12em]">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} eagerFirst={4} />
        ) : (
          <p className="text-muted py-12">{emptyMessage}</p>
        )}
      </Container>
    </>
  );
}
