import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container, PageHero } from "@/components/container";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { WishlistButton } from "@/components/wishlist-button";
import { getProductsByIds } from "@/lib/shopify";
import { getWishlistIds } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <>
      <PageHero eyebrow="Saved for later" title="Wishlist" />
      <Container className="py-14 sm:py-20">
        <Suspense fallback={<ProductGridSkeleton />}>
          <SavedProducts />
        </Suspense>
      </Container>
    </>
  );
}

async function SavedProducts() {
  const ids = await getWishlistIds();
  const products = await getProductsByIds(ids);

  if (products.length === 0) {
    return (
      <div className="bg-surface px-6 py-16 text-center">
        <p className="font-serif text-2xl italic">Your wishlist is empty.</p>
        <p className="text-muted mt-2 text-sm">
          Tap the heart on any product to save it here.
        </p>
        <Link
          href="/shop"
          className="bg-olive text-cream hover:bg-olive-deep mt-8 inline-flex px-8 py-3.5 font-sans text-xs tracking-[0.24em] uppercase"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <ProductGrid
      products={products}
      eagerFirst={4}
      renderAction={(product) => (
        <WishlistButton productId={product.id} saved variant="text" />
      )}
    />
  );
}
