"use client";

import { getShopPayButtonUrl } from "@shopify/hydrogen";
import { cn } from "cn";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { useOpenCart } from "@/components/cart/context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import type { Money } from "@/lib/money/types";
import { getProductPurchaseOptions } from "@/lib/product";
import { useProductForm } from "@/lib/product/client";
import type { ProductFormVariant, SellingPlanAllocation } from "@/lib/product/types";

import { BuyWithShopLogo } from "./buy-with-shop-logo";

interface BuyButtonsProps {
  availableForSale?: boolean;
  buyWithShop?: boolean;
  fallbackVariant: ProductFormVariant | undefined;
  onAddToCart?: () => void;
  quantityPicker?: boolean;
}

export function BuyButtons({
  availableForSale = true,
  buyWithShop = true,
  fallbackVariant,
  onAddToCart,
  quantityPicker = true,
}: BuyButtonsProps) {
  const { formProps, pending, register, selectedVariant: storeVariant } = useProductForm();
  const selectedVariant = storeVariant ?? fallbackVariant;
  const isSelectionUnresolved = !storeVariant;
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const quantityLabelId = useId();
  const [quantity, setQuantity] = useState(1);
  const [purchaseOption, setPurchaseOption] = useState("");
  const { plans, selectedPlan } = getProductPurchaseOptions(selectedVariant, purchaseOption);
  const missingRequiredPlan = Boolean(selectedVariant?.requiresSellingPlan && !selectedPlan);
  const openCart = useOpenCart();

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsBuyingNow(false);
        setIsCheckingOut(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
  if (!selectedVariant) {
    return null;
  }
  const requiresBundleConfiguration = selectedVariant.requiresBundleConfiguration;
  const isOutOfStock = !selectedVariant.availableForSale;
  // Keep href while buying: removing it during the click cancels the anchor's navigation.
  const buyNowUrl = getShopPayButtonUrl({
    disabled: isSelectionUnresolved || isOutOfStock || requiresBundleConfiguration || pending,
    variants: [{ id: selectedVariant.id, quantity }],
  });
  // Checkout Now buys only this item, like Shopify's "Buy it now", and leaves the cart untouched.
  // proxy.ts forwards `/buy/` permalinks to Shopify's standard checkout; `/cart/` ones would force Shop Pay.
  const checkoutNowUrl =
    isSelectionUnresolved || isOutOfStock || requiresBundleConfiguration || pending
      ? undefined
      : `/buy/${selectedVariant.id.split("/").at(-1)}:${quantity}`;
  const getButtonText = () => {
    if (pending) return "Adding to Cart...";
    if (isSelectionUnresolved) return "Add To Cart";
    if (requiresBundleConfiguration) return "Choose bundle items";
    if (missingRequiredPlan) return "Subscription unavailable";
    if (isOutOfStock) return "Out of Stock";
    return "Add To Cart";
  };
  return (
    <form
      {...formProps({
        beforeSubmit: (event) => {
          if (
            isSelectionUnresolved ||
            isOutOfStock ||
            requiresBundleConfiguration ||
            missingRequiredPlan ||
            pending
          ) {
            event.preventDefault();
            return;
          }
          onAddToCart?.();
          openCart();
        },
      })}
      className="grid gap-6"
    >
      <PurchaseOptions
        disabled={pending || isSelectionUnresolved}
        onSelect={setPurchaseOption}
        plans={plans}
        price={selectedVariant.price}
        requiresSellingPlan={selectedVariant.requiresSellingPlan}
        selectedPlan={selectedPlan}
      />
      <input type="hidden" name="sellingPlanId" value={selectedPlan?.sellingPlan.id ?? ""} />
      <input type="hidden" {...register("merchandiseId", {})} />
      <input type="hidden" {...register("quantity", { value: quantity })} />
      {quantityPicker ? (
        <div className="flex items-center gap-4">
          <span className="text-lg" id={quantityLabelId}>
            Quantity:
          </span>
          <div
            aria-labelledby={quantityLabelId}
            className="grid h-11 w-28 shrink-0 grid-cols-3 items-center rounded-md border border-foreground/80"
            role="group"
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              className="flex h-full cursor-pointer items-center justify-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={quantity === 1}
              onClick={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
            >
              <MinusIcon className="size-4 shrink-0" />
            </button>
            <span aria-live="polite" className="text-center text-base tabular-nums" role="status">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="flex h-full cursor-pointer items-center justify-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={quantity === 99}
              onClick={() => setQuantity((currentQuantity) => Math.min(99, currentQuantity + 1))}
            >
              <PlusIcon className="size-4 shrink-0" />
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3.5">
        <Button
          {...register("addToCart", {})}
          data-selection-unresolved={isSelectionUnresolved && !pending}
          disabled={
            isSelectionUnresolved ||
            isOutOfStock ||
            requiresBundleConfiguration ||
            missingRequiredPlan ||
            pending
          }
          className="h-12.5 min-w-36 flex-1 justify-center rounded-md text-base sm:text-lg data-[selection-unresolved=true]:disabled:opacity-100"
        >
          {getButtonText()}
        </Button>
        {!selectedPlan && !selectedVariant.requiresSellingPlan ? (
          <a
            aria-busy={isCheckingOut || undefined}
            aria-disabled={checkoutNowUrl ? undefined : true}
            className="flex h-12.5 min-w-36 flex-1 cursor-pointer items-center justify-center rounded-md bg-white px-4 text-base text-olive-deep transition-colors hover:bg-white/85 aria-busy:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 sm:text-lg"
            href={checkoutNowUrl}
            onClick={(event) => {
              if (!checkoutNowUrl || isCheckingOut) {
                event.preventDefault();
                return;
              }
              setIsCheckingOut(true);
            }}
            rel="nofollow"
          >
            {isCheckingOut ? <Loader2 className="size-4 animate-spin" /> : "Checkout Now"}
          </a>
        ) : null}
      </div>
      {buyWithShop && !selectedPlan && !selectedVariant.requiresSellingPlan ? (
        <a
          aria-busy={isBuyingNow || undefined}
          aria-disabled={buyNowUrl ? undefined : true}
          aria-label="Buy with Shop Pay"
          className={cn(
            "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-shop px-4 text-white transition-colors hover:bg-shop/85 aria-busy:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[selection-unresolved=true]:aria-disabled:opacity-100",
            !availableForSale && "invisible",
          )}
          data-selection-unresolved={isSelectionUnresolved}
          href={buyNowUrl ?? undefined}
          onClick={(event) => {
            if (!buyNowUrl || isBuyingNow) {
              event.preventDefault();
              return;
            }
            setIsBuyingNow(true);
          }}
          rel="nofollow"
        >
          {isBuyingNow ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span className="sr-only">Buy with</span>
              <BuyWithShopLogo aria-hidden="true" className="h-auto w-24.5" />
            </>
          )}
        </a>
      ) : null}
    </form>
  );
}

interface PurchaseOptionsProps {
  disabled?: boolean;
  onSelect?: (id: string) => void;
  plans: SellingPlanAllocation[];
  price: Money;
  requiresSellingPlan: boolean;
  selectedPlan: SellingPlanAllocation | undefined;
}

export function PurchaseOptions({
  disabled = false,
  onSelect,
  plans,
  price,
  requiresSellingPlan,
  selectedPlan,
}: PurchaseOptionsProps) {
  const purchaseOptionId = useId();
  if (plans.length === 0) return null;

  return (
    <fieldset className="grid gap-2.5" disabled={disabled}>
      <legend className="pb-2.5 text-sm font-medium">Purchase options</legend>
      {[
        ...(!requiresSellingPlan ? [{ id: "", name: "One-time purchase", price }] : []),
        ...plans.map((allocation) => ({
          id: allocation.sellingPlan.id,
          name: allocation.sellingPlan.name,
          price: allocation.price,
        })),
      ].map((option) => (
        <label
          key={option.id}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-4 has-checked:border-foreground has-disabled:cursor-not-allowed has-disabled:opacity-50"
        >
          <input
            type="radio"
            name={purchaseOptionId}
            value={option.id}
            checked={(selectedPlan?.sellingPlan.id ?? "") === option.id}
            onChange={onSelect ? () => onSelect(option.id) : undefined}
            readOnly={!onSelect}
            className="size-4 cursor-pointer accent-foreground disabled:cursor-not-allowed"
          />
          <span className="flex flex-1 flex-wrap items-center justify-between gap-2.5 text-sm">
            <span>{option.name}</span>
            <span className="tabular-nums">{formatPrice(option.price)}</span>
          </span>
        </label>
      ))}
      {selectedPlan ? (
        <p className="text-sm text-muted-foreground">
          Recurring purchase.{" "}
          {selectedPlan.sellingPlan.description || "Subscription details are shown at checkout."}
        </p>
      ) : null}
    </fieldset>
  );
}
