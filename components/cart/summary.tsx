"use client";

import type { CartData } from "@shopify/hydrogen";
import { cn } from "cn";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCart, useCheckout } from "@/lib/cart/client";
import { formatPrice } from "@/lib/money";

interface CartSummaryProps {
  cart: CartData;
}

export function CartSummary({ cart }: CartSummaryProps) {
  const isCostPending = useCart((state) =>
    Boolean(state.loading || state.pending.cost || state.revalidating),
  );
  const { subtotalAmount, totalAmount } = cart.cost;
  const discount = Number(subtotalAmount.amount) - Number(totalAmount.amount);
  const money = (value: ReactNode) =>
    isCostPending || !totalAmount.currencyCode ? (
      <span className="text-muted-foreground">Updating…</span>
    ) : (
      value
    );

  return (
    <section
      aria-busy={isCostPending || undefined}
      aria-labelledby="cart-total-heading"
      className="rounded-md border-[1.5px] border-foreground/90 p-6"
    >
      <h2 className="text-xl font-medium" id="cart-total-heading">
        Cart Total
      </h2>
      <dl className="mt-3 divide-y divide-foreground/40">
        <SummaryRow label="Subtotal:">{money(formatPrice(subtotalAmount))}</SummaryRow>
        {discount > 0 ? (
          <SummaryRow label="Discount:">
            {money(
              `−${formatPrice({ amount: String(discount), currencyCode: totalAmount.currencyCode })}`,
            )}
          </SummaryRow>
        ) : null}
        {/* Shopify works out shipping (free on U.S. orders over $150) at checkout. */}
        <SummaryRow label="Shipping:">Calculated at checkout</SummaryRow>
        <SummaryRow emphasized label="Total:">
          {money(formatPrice(totalAmount))}
        </SummaryRow>
      </dl>
      <p className="text-xs text-muted-foreground">Taxes are calculated at checkout.</p>
      <CartCheckout className="mt-6" label="Proceed to checkout" />
    </section>
  );
}

/** Compact estimated total, used by the Shop Agent's cart card. */
export function CartTotal({ cart }: CartSummaryProps) {
  const isCostPending = useCart((state) =>
    Boolean(state.loading || state.pending.cost || state.revalidating),
  );
  const { totalAmount } = cart.cost;
  return (
    <div
      aria-busy={isCostPending || undefined}
      aria-label="Estimated total"
      className="grid gap-1"
      role="group"
    >
      <div className="flex items-baseline justify-between text-base">
        <span>Estimated total</span>
        <span className="text-xl font-medium tabular-nums">
          {isCostPending || !totalAmount.currencyCode ? "Updating…" : formatPrice(totalAmount)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Taxes and shipping calculated at checkout.</p>
    </div>
  );
}

interface SummaryRowProps {
  children: ReactNode;
  emphasized?: boolean;
  label: string;
}

function SummaryRow({ children, emphasized = false, label }: SummaryRowProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-3.5 tabular-nums",
        emphasized && "font-semibold",
      )}
    >
      <dt>{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

interface CartCheckoutProps {
  className?: string;
  label?: string;
}

export function CartCheckout({ className, label = "Checkout" }: CartCheckoutProps) {
  const {
    checkoutError,
    checkoutErrorId,
    handleCheckout,
    isCheckingOut,
    isCheckoutDisabled,
    isUpdatingCart,
  } = useCheckout();
  return (
    <div className={cn("grid justify-items-center gap-2.5", className)}>
      <Button
        aria-busy={isCheckingOut || isUpdatingCart || undefined}
        aria-describedby={checkoutError ? checkoutErrorId : undefined}
        className="h-12 w-full max-w-66 justify-center rounded-md px-10 text-base font-normal"
        disabled={isCheckoutDisabled}
        onClick={handleCheckout}
        type="button"
      >
        {isCheckingOut || isUpdatingCart ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isCheckingOut ? "Redirecting..." : isUpdatingCart ? "Updating cart..." : label}
      </Button>
      {checkoutError ? (
        <p className="text-xs text-destructive" id={checkoutErrorId} role="alert">
          {checkoutError}
        </p>
      ) : null}
    </div>
  );
}
