import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductCard, ProductCardSkeleton } from "@/components/product-card/product-card";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { getWishlistProducts } from "@/lib/wishlist/server";

export const metadata: Metadata = {
  robots: { index: false },
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <Page>
      <Container className="grid gap-10 pb-16">
        <div className="grid gap-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Saved for later
          </p>
          <h1 className="font-serif text-5xl font-light italic">Wishlist</h1>
        </div>
        <Suspense fallback={<WishlistSkeleton />}>
          <WishlistProducts />
        </Suspense>
      </Container>
    </Page>
  );
}

async function WishlistProducts() {
  const products = await getWishlistProducts();

  if (products.length === 0) {
    return (
      <div className="grid justify-items-center gap-4 bg-muted px-6 py-16 text-center">
        <p className="font-serif text-2xl italic">Your wishlist is empty.</p>
        <p className="text-sm text-muted-foreground">
          Tap the heart on any product to save it here.
        </p>
        <Link
          className="mt-4 inline-flex bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.24em] text-primary-foreground hover:bg-olive-deep"
          href="/collections/all"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <li className="grid content-start gap-3" key={product.id}>
          <ProductCard outOfStockText="Sold out" product={product} quickShopText="Choose" />
          <WishlistButton productId={product.id} saved variant="text" />
        </li>
      ))}
    </ul>
  );
}

function WishlistSkeleton() {
  return (
    <div aria-busy="true" className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
