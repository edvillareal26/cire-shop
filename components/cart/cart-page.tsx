"use client";

import { cn } from "cn";
import { ArrowLeft } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseCart } from "@/lib/cart/client";

import { CART_COLUMNS, CART_ROW, CartLineItems } from "./line-item";
import { CartSummary } from "./summary";
import { CartWarnings } from "./warnings";

const BUTTON_CLASS =
  "inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base text-primary-foreground transition-colors hover:bg-primary/90";

export function CartPageContent() {
  const cart = useSuspenseCart((state) => state.data);

  if (cart.totalQuantity === 0) {
    return (
      <CartPageLayout>
        <div className="grid justify-items-center gap-6 rounded-md border border-foreground/40 px-6 py-16 text-center">
          <CartWarnings />
          <h2 className="text-2xl sm:text-3xl">Your cart is empty</h2>
          <Link className={BUTTON_CLASS} href="/collections/all">
            Continue Shopping
          </Link>
        </div>
      </CartPageLayout>
    );
  }

  return (
    <CartPageLayout summary={<CartSummary cart={cart} />}>
      <CartWarnings />
      <CartTable>
        <CartLineItems lines={cart.lines.nodes} />
      </CartTable>
    </CartPageLayout>
  );
}

export function CartPageSkeleton() {
  return (
    <CartPageLayout
      aria-busy="true"
      summary={
        <div className="grid gap-5 rounded-md border-[1.5px] border-foreground/40 p-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="mx-auto h-12 w-56" />
        </div>
      }
    >
      <CartTable>
        <div className="grid gap-3.5">
          {[0, 1].map((index) => (
            <div className={CART_ROW} key={index}>
              <div className="flex h-25 items-center gap-4 rounded-md border border-foreground/40 px-4 md:px-9">
                <Skeleton className="size-13 rounded-sm" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          ))}
        </div>
      </CartTable>
    </CartPageLayout>
  );
}

function CartTable({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3.5">
      {/* Each line also labels its price and subtotal for screen readers. */}
      <div aria-hidden="true" className={cn(CART_ROW, "hidden md:grid")}>
        <div
          className={cn(
            "h-17 rounded-md bg-primary px-9 font-semibold text-primary-foreground",
            CART_COLUMNS,
          )}
        >
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span className="text-right">Subtotal</span>
        </div>
      </div>
      {children}
    </div>
  );
}

interface CartPageLayoutProps extends ComponentProps<"div"> {
  summary?: ReactNode;
}

function CartPageLayout({ children, summary, ...props }: CartPageLayoutProps) {
  return (
    <Page className="pb-20 lg:pt-14 lg:pb-28" {...props}>
      <Container className="grid max-w-320 gap-10 lg:gap-14">
        <Breadcrumbs current="Cart" links={[{ href: "/", label: "Home" }]} />
        <div className="grid gap-10">
          <h1 className="sr-only">Cart</h1>
          <Link
            className="flex w-fit items-center gap-2.5 text-lg transition-opacity hover:opacity-75"
            href="/collections/all"
          >
            <ArrowLeft aria-hidden className="size-5" />
            Return To Shop
          </Link>
          {children}
          {summary ? <div className="w-full justify-self-end sm:max-w-117">{summary}</div> : null}
        </div>
      </Container>
    </Page>
  );
}
