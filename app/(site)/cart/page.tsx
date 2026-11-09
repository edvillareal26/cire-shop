import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Container, PageHero } from "@/components/container";
import { Price } from "@/components/price";
import { readCart } from "@/lib/cart";
import type { CartLine } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/utils";
import { LineQuantity } from "./line-quantity";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero eyebrow="Review your order" title="Your Cart" />
      <Container className="py-14 sm:py-20">
        <Suspense fallback={<CartSkeleton />}>
          <CartContents />
        </Suspense>
      </Container>
    </>
  );
}

async function CartContents() {
  const cart = await readCart();
  const lines = cart?.lines.nodes ?? [];

  if (!cart || lines.length === 0) {
    return (
      <div className="bg-surface px-6 py-16 text-center">
        <p className="font-serif text-2xl italic">Your cart is empty.</p>
        <Link
          href="/shop"
          className="bg-olive text-cream hover:bg-olive-deep mt-8 inline-flex px-8 py-3.5 font-sans text-xs tracking-[0.24em] uppercase"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <ul className="divide-border border-border divide-y border-y">
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>

      <aside
        aria-labelledby="summary-heading"
        className="bg-surface h-fit space-y-5 p-7"
      >
        <h2 id="summary-heading" className="font-serif text-2xl italic">
          Order summary
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">
              {formatMoney(cart.cost.subtotalAmount)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Shipping & taxes</dt>
            <dd className="text-muted text-right">Calculated at checkout</dd>
          </div>
        </dl>
        {/*
          Shopify's hosted checkout collects shipping, payment and taxes, then
          creates the order. The checkout URL is unique to this cart.
        */}
        <a
          href={cart.checkoutUrl}
          className="bg-olive text-cream hover:bg-olive-deep flex h-12 w-full items-center justify-center font-sans text-xs tracking-[0.24em] uppercase transition-colors"
        >
          Check out
        </a>
        <p className="text-muted text-center text-xs">
          Free U.S. shipping on orders $150+
        </p>
        <Link
          href="/shop"
          className="text-muted block text-center text-sm underline-offset-4 hover:underline"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}

function CartLineItem({ line }: { line: CartLine }) {
  const { merchandise } = line;
  const image = merchandise.image ?? merchandise.product.featuredImage;
  const href = `/products/${merchandise.product.handle}`;
  const options = merchandise.selectedOptions.filter(
    (o) => !(o.name === "Title" && o.value === "Default Title"),
  );

  return (
    <li className="flex gap-5 py-7 sm:gap-7">
      <Link
        href={href}
        className="bg-surface relative aspect-[4/5] w-24 shrink-0 overflow-hidden sm:w-28"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? merchandise.product.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
        <div>
          <Link href={href} className="font-serif text-xl hover:underline hover:underline-offset-4">
            {merchandise.product.title}
          </Link>
          {options.length > 0 ? (
            <p className="text-muted mt-1 text-sm">
              {options.map((o) => `${o.name}: ${o.value}`).join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-6 sm:flex-col sm:items-end">
          <Price className="font-sans tabular-nums" amount={line.cost.totalAmount} />
          <LineQuantity lineId={line.id} quantity={line.quantity} />
        </div>
      </div>
    </li>
  );
}

function CartSkeleton() {
  return (
    <div aria-hidden className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div className="space-y-7">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-7">
            <div className="bg-surface aspect-[4/5] w-28 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="bg-surface h-5 w-1/2 animate-pulse" />
              <div className="bg-surface h-4 w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-surface h-64 animate-pulse" />
    </div>
  );
}
