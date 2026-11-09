"use client";

import { cn } from "cn";

import { useOpenCart } from "@/components/cart/context";
import { useCartForm } from "@/lib/cart/client";

interface AddToCartButtonProps {
  available: boolean;
  className?: string;
  variantId: string | null;
}

/** Adds one of a single-variant product, then opens the cart page. */
export function AddToCartButton({ available, className, variantId }: AddToCartButtonProps) {
  const { formProps, register } = useCartForm();
  const openCart = useOpenCart();
  const canAdd = available && Boolean(variantId);

  return (
    <form
      {...formProps({
        beforeSubmit: (event) => {
          if (!canAdd) {
            event.preventDefault();
            return;
          }
          openCart();
        },
      })}
    >
      <input type="hidden" {...register("merchandiseId", { value: variantId ?? "" })} />
      <input type="hidden" {...register("quantity", { value: 1 })} />
      <button
        {...register("add")}
        className={cn(
          "h-9 w-full cursor-pointer bg-[#f1ebe0] text-xs tracking-[0.14em] text-[#2e3226] uppercase transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        disabled={!canAdd}
        type="submit"
      >
        {canAdd ? "Add to cart" : "Sold out"}
      </button>
    </form>
  );
}
