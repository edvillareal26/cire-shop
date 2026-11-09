import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Price } from "@/components/price";
import type { ProductCard as ProductCardData } from "@/lib/shopify/types";

export function ProductGrid({
  products,
  eagerFirst = 0,
  renderAction,
}: {
  products: ProductCardData[];
  /** Load the first N images eagerly (for grids that start above the fold). */
  eagerFirst?: number;
  /** Optional control rendered under each card (e.g. "Remove"). */
  renderAction?: (product: ProductCardData) => ReactNode;
}) {
  if (products.length === 0) {
    return <p className="text-muted py-12">No products to show yet.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} eager={i < eagerFirst} />
          {renderAction ? <div className="mt-3">{renderAction(product)}</div> : null}
        </li>
      ))}
    </ul>
  );
}

function ProductCard({
  product,
  eager,
}: {
  product: ProductCardData;
  eager: boolean;
}) {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;
  const image = product.featuredImage;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="bg-surface relative aspect-[4/5] overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
        {!product.availableForSale ? (
          <span className="bg-cream/90 absolute top-3 left-3 px-2.5 py-1 font-sans text-[10px] tracking-[0.2em] uppercase">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="mt-4 space-y-1.5">
        {product.productType ? (
          <p className="text-muted font-sans text-[10px] tracking-[0.24em] uppercase">
            {product.productType}
          </p>
        ) : null}
        <h3 className="font-serif text-xl leading-snug group-hover:underline group-hover:underline-offset-4">
          {product.title}
        </h3>
        <Price
          className="text-muted font-sans text-sm"
          amount={minVariantPrice}
          compareAt={product.compareAtPriceRange.minVariantPrice}
          prefix={hasRange ? "From" : undefined}
        />
      </div>
    </Link>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul
      aria-hidden
      className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="bg-surface aspect-[4/5] animate-pulse" />
          <div className="bg-surface mt-4 h-3 w-1/3 animate-pulse" />
          <div className="bg-surface mt-2 h-5 w-2/3 animate-pulse" />
        </li>
      ))}
    </ul>
  );
}
