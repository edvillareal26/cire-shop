import Image from "next/image";
import { Suspense } from "react";

import { Emblem } from "@/components/brand/emblem";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { formatPrice } from "@/lib/money";
import { getCollectionBundles } from "@/lib/product/server";
import type { BundleCard } from "@/lib/product/types";

/** Shopify collection holding the sets shown here; the footer's "The Cire Set" links to it too. */
export const CIRE_SET_COLLECTION = "the-cire-retention-collection";

// Keyed by Shopify product handle; a set without an entry lists its Shopify Bundles components.
const SET_CONTENTS: Record<string, string[]> = {
  "cire-retention-set": ["Lash Adhesive", "Lash Super Bonder", "Lash Primer"],
  "the-retention-duo": ["Lash Adhesive", "Lash Super Bonder"],
};

export function TheCireSet() {
  return (
    <Suspense fallback={null}>
      <ResolvedCireSet />
    </Suspense>
  );
}

// Hidden until the collection exists in Shopify and holds at least one product.
async function ResolvedCireSet() {
  const bundles = await getCollectionBundles({ collectionHandle: CIRE_SET_COLLECTION, limit: 4 });
  if (bundles.length === 0) return null;

  return (
    <section
      aria-labelledby="cire-set-heading"
      className="grid min-h-section content-center bg-olive py-20 text-cream sm:pt-24 sm:pb-36"
      data-full-page-section
    >
      <Container className="grid gap-10 sm:gap-8 lg:px-[5.8%]">
        <header className="relative grid justify-items-center pt-21 text-center sm:pt-[clamp(5.5rem,7.4vw,6.75rem)]">
          <Emblem className="absolute top-0 left-1/2 w-30 -translate-x-1/2 text-cream/15 sm:w-[clamp(8rem,10.7vw,9.75rem)]" />
          <h2
            className="relative font-serif text-[clamp(2rem,2.8vw,2.5rem)]/none font-normal tracking-[0.1em] uppercase"
            id="cire-set-heading"
          >
            The Cire Set
          </h2>
          <p className="relative mt-3 max-w-112 text-[13px] leading-snug tracking-[0.12em] text-cream/90">
            A considered selection of Cire essentials, brought together with intention.
          </p>
        </header>

        <div className="grid gap-6">
          <Link
            className="justify-self-end text-sm tracking-[0.08em] text-cream/80 uppercase underline underline-offset-4 transition-colors hover:text-cream"
            href={`/collections/${CIRE_SET_COLLECTION}`}
          >
            Shop the Cire Set →
          </Link>
          <ul className="grid gap-x-18 gap-y-14 md:grid-cols-2">
            {bundles.map((bundle) => (
              <li key={bundle.id}>
                <BundleCardView bundle={bundle} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function BundleCardView({ bundle }: { bundle: BundleCard }) {
  const href = `/products/${bundle.handle}`;
  const saving = bundle.compareAtPrice
    ? Number(bundle.compareAtPrice.amount) - Number(bundle.price.amount)
    : 0;
  const contents = SET_CONTENTS[bundle.handle] ?? bundle.components;

  return (
    <article className="grid gap-3">
      <Link className="group relative block aspect-17/10 overflow-hidden bg-cream/10" href={href}>
        {bundle.featuredImage ? (
          <Image
            alt={bundle.featuredImage.altText || bundle.title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            src={bundle.featuredImage.url}
          />
        ) : null}
        {saving > 0 ? (
          <span className="absolute top-3 left-4 rounded-full bg-olive px-6 py-2 text-[13px] font-semibold tracking-[0.08em] uppercase">
            Save{" "}
            {formatPrice({ amount: saving.toFixed(2), currencyCode: bundle.price.currencyCode })}
          </span>
        ) : null}
      </Link>
      <div className="grid gap-1 px-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-[1.375rem] font-semibold tracking-[0.06em]">
            <Link className="transition-opacity hover:opacity-80" href={href}>
              {bundle.title}
            </Link>
          </h3>
          <p className="shrink-0 text-[15px] tracking-[0.06em] tabular-nums">
            {formatPrice(bundle.price)}
          </p>
        </div>
        {contents.length > 0 ? (
          <p className="text-sm tracking-[0.08em] text-cream/85">{contents.join(" + ")}</p>
        ) : null}
      </div>
      <AddToCartButton available={bundle.availableForSale} variantId={bundle.variantId} />
    </article>
  );
}
