import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container, HeaderBand } from "@/components/container";
import { WishlistButton } from "@/components/wishlist-button";
import { getProduct, getProducts } from "@/lib/shopify";
import { getWishlistIds } from "@/lib/wishlist";
import { ProductView } from "./product-view";

// Prerender the best sellers at build time; every other product page is served
// its loading shell on first visit and cached once rendered.
export async function generateStaticParams() {
  const products = await getProducts({ first: 24, sortKey: "BEST_SELLING" });
  // Cache Components requires at least one entry; an empty store still needs a
  // placeholder, which resolves to the 404 page.
  if (products.length === 0) return [{ handle: "__none__" }];
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };

  const image = product.featuredImage;
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description || undefined,
    openGraph: image
      ? {
          images: [
            {
              url: image.url,
              width: image.width ?? undefined,
              height: image.height ?? undefined,
              alt: image.altText ?? product.title,
            },
          ],
        }
      : undefined,
  };
}

export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <>
      <HeaderBand>
        <Link
          href="/shop"
          className="text-cream/75 hover:text-cream font-sans text-[11px] tracking-[0.24em] uppercase"
        >
          ← Back to shop
        </Link>
      </HeaderBand>
      <Container className="py-12 sm:py-16">
        <Suspense fallback={<ProductSkeleton />}>
          <ProductContent params={params} />
        </Suspense>
      </Container>
    </>
  );
}

async function ProductContent({
  params,
}: Pick<PageProps<"/products/[handle]">, "params">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <ProductView
      product={product}
      wishlist={
        <Suspense fallback={<WishlistButton productId={product.id} saved={false} />}>
          <WishlistToggle productId={product.id} />
        </Suspense>
      }
    >
      {product.descriptionHtml ? (
        <div
          className="rich-text text-muted text-[15px]"
          // descriptionHtml is authored by the merchant in Shopify admin.
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </ProductView>
  );
}

/** Reads the visitor's wishlist cookie, so it streams in after the page. */
async function WishlistToggle({ productId }: { productId: string }) {
  const ids = await getWishlistIds();
  return <WishlistButton productId={productId} saved={ids.includes(productId)} />;
}

function ProductSkeleton() {
  return (
    <div aria-hidden className="grid gap-10 md:grid-cols-2 lg:gap-20">
      <div className="bg-surface aspect-[4/5] animate-pulse" />
      <div className="space-y-4">
        <div className="bg-surface h-3 w-28 animate-pulse" />
        <div className="bg-surface h-10 w-3/4 animate-pulse" />
        <div className="bg-surface h-6 w-24 animate-pulse" />
        <div className="bg-surface mt-10 h-12 w-full animate-pulse" />
      </div>
    </div>
  );
}
