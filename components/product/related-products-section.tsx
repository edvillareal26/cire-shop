import { type ReactNode, Suspense } from "react";

import { ProductCard, ProductCardSkeleton } from "@/components/product-card/product-card";
import { Link } from "@/components/ui/link";
import { getProductRecommendations } from "@/lib/product/server";

const GRID_CLASS = "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8";

function SectionShell({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="related-products" className="grid gap-10 lg:gap-14">
      <hr className="dashed-rule text-foreground/40" />
      <div className="grid gap-8">
        <div className="flex items-end justify-between gap-4">
          <h2
            className="text-[clamp(1.5rem,2.2vw,2rem)] leading-tight font-semibold"
            id="related-products"
          >
            Related Products
          </h2>
          <Link
            className="shrink-0 text-lg underline underline-offset-4 transition-colors hover:text-muted-foreground"
            href="/collections/all"
          >
            View All
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

function RelatedProductsSectionSkeleton({ limit }: { limit: number }) {
  return (
    <SectionShell>
      <div className={GRID_CLASS}>
        {Array.from({ length: limit }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </SectionShell>
  );
}

async function Render({ handle, limit }: { handle: string; limit: number }) {
  const related = await getProductRecommendations({ handle, intent: "RELATED" });
  if (related.length === 0) return null;
  return (
    <SectionShell>
      <div className={GRID_CLASS}>
        {related.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} outOfStockText="Out of Stock" />
        ))}
      </div>
    </SectionShell>
  );
}

export function RelatedProductsSection({ handle, limit }: { handle: string; limit: number }) {
  return (
    <Suspense fallback={<RelatedProductsSectionSkeleton limit={limit} />}>
      <Render handle={handle} limit={limit} />
    </Suspense>
  );
}
