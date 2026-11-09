"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { addToCart, type CartActionState } from "@/app/(site)/cart/actions";
import { Price } from "@/components/price";
import type {
  Image as ShopifyImage,
  Product,
  ProductVariant,
} from "@/lib/shopify/types";

type Selection = Record<string, string>;

function findVariant(variants: ProductVariant[], selection: Selection) {
  return variants.find((v) =>
    v.selectedOptions.every((o) => selection[o.name] === o.value),
  );
}

function toSelection(variant: ProductVariant | undefined): Selection {
  return Object.fromEntries(
    variant?.selectedOptions.map((o) => [o.name, o.value]) ?? [],
  );
}

export function ProductView({
  product,
  wishlist,
  children,
}: {
  product: Product;
  /** Wishlist toggle, rendered next to "Add to cart". */
  wishlist?: ReactNode;
  children?: ReactNode;
}) {
  const variants = product.variants.nodes;
  const [selection, setSelection] = useState<Selection>(() =>
    toSelection(variants.find((v) => v.availableForSale) ?? variants[0]),
  );
  const variant = findVariant(variants, selection);

  const images = galleryImages(product);
  const [activeUrl, setActiveUrl] = useState(
    () => variant?.image?.url ?? images[0]?.url,
  );
  const activeImage =
    images.find((i) => i.url === activeUrl) ??
    variants.find((v) => v.image?.url === activeUrl)?.image ??
    images[0];

  function select(name: string, value: string) {
    const next = { ...selection, [name]: value };
    setSelection(next);
    const image = findVariant(variants, next)?.image;
    if (image) setActiveUrl(image.url);
  }

  // Products without real options have a single "Title: Default Title" option.
  const visibleOptions = product.options.filter(
    (o) => !(product.options.length === 1 && o.optionValues.length <= 1),
  );

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:gap-20">
      <section aria-label="Product images" className="min-w-0">
        <div className="bg-surface relative aspect-[4/5] overflow-hidden">
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        {images.length > 1 ? (
          <ul className="-mx-1 mt-3 flex snap-x scroll-px-1 gap-3 overflow-x-auto p-1">
            {images.map((image, i) => (
              <li key={image.url} className="w-16 shrink-0 snap-start sm:w-[4.5rem]">
                <button
                  type="button"
                  onClick={() => setActiveUrl(image.url)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-current={image.url === activeImage?.url}
                  className="bg-surface ring-offset-background aria-[current=true]:ring-olive relative block aspect-[4/5] w-full overflow-hidden ring-offset-2 aria-[current=true]:ring-1"
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="min-w-0 md:pt-4">
        {product.productType ? (
          <p className="text-muted mb-3 font-sans text-[11px] tracking-[0.28em] uppercase">
            {product.productType}
          </p>
        ) : null}
        <h1 className="font-serif text-4xl leading-tight font-light sm:text-5xl">
          {product.title}
        </h1>
        <Price
          className="mt-4 font-sans text-lg"
          amount={variant?.price ?? product.priceRange.minVariantPrice}
          compareAt={variant?.compareAtPrice}
        />

        <div className="mt-10 space-y-7">
          {visibleOptions.map((option) => (
            <fieldset key={option.name}>
              <legend className="mb-3 font-sans text-[11px] tracking-[0.24em] uppercase">
                {option.name}
                <span className="text-muted normal-case tracking-normal">
                  {" "}
                  · {selection[option.name]}
                </span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {option.optionValues.map(({ name: value }) => {
                  const candidate = findVariant(variants, {
                    ...selection,
                    [option.name]: value,
                  });
                  const available = !!candidate?.availableForSale;
                  const selected = selection[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => select(option.name, value)}
                      className={[
                        "min-w-12 border px-4 py-2.5 font-sans text-xs tracking-[0.08em] transition-colors",
                        selected
                          ? "border-olive bg-olive text-cream"
                          : "border-foreground/25 hover:border-olive",
                        available ? "" : "text-muted line-through",
                      ].join(" ")}
                    >
                      {value}
                      {available ? null : (
                        <span className="sr-only"> (unavailable)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <AddToCartForm variant={variant} wishlist={wishlist} />

        {children ? (
          <div className="border-border mt-10 border-t pt-8">{children}</div>
        ) : null}
      </section>
    </div>
  );
}

function AddToCartForm({
  variant,
  wishlist,
}: {
  variant: ProductVariant | undefined;
  wishlist?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState<CartActionState, FormData>(
    addToCart,
    { status: "idle" },
  );
  const available = !!variant?.availableForSale;
  const label = !variant
    ? "Unavailable"
    : !available
      ? "Sold out"
      : pending
        ? "Adding…"
        : "Add to cart";

  return (
    <div className="mt-10">
      <div className="flex gap-3">
        <form action={formAction} className="flex flex-1 gap-3">
          <input type="hidden" name="merchandiseId" value={variant?.id ?? ""} />
          <label className="sr-only" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={999}
            defaultValue={1}
            className="border-foreground/25 bg-background h-12 w-[4.5rem] border px-3 text-center font-sans text-sm"
          />
          <button
            type="submit"
            disabled={!available || pending}
            className="bg-olive text-cream hover:bg-olive-deep h-12 flex-1 font-sans text-xs tracking-[0.24em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {label}
          </button>
        </form>
        {wishlist}
      </div>
      <div aria-live="polite" className="mt-3 min-h-5 text-sm">
        {state.status === "success" && !pending ? (
          <p className="text-success">
            {state.message}.{" "}
            <Link href="/cart" className="text-foreground underline underline-offset-4">
              View cart
            </Link>
          </p>
        ) : null}
        {state.status === "error" && !pending ? (
          <p className="text-danger" role="alert">
            {state.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function galleryImages(product: Product): ShopifyImage[] {
  const seen = new Set<string>();
  const all = [...product.images.nodes];
  if (product.featuredImage) all.unshift(product.featuredImage);
  return all.filter((image) => {
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}
