"use client";

import type { CartLine as HydrogenCartLine } from "@shopify/hydrogen";
import { cn } from "cn";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import Image from "next/image";

import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Link } from "@/components/ui/link";
import { useCart } from "@/lib/cart/client";
import type { CartLine } from "@/lib/cart/types";
import { formatPrice } from "@/lib/money";

import { CartLineForm } from "./line-form";
import { CartWarnings } from "./warnings";

/** Product, Price, Quantity and Subtotal columns, shared by the header bar and each line from `md` up. */
export const CART_COLUMNS = "md:grid md:grid-cols-[33.4fr_27.9fr_24fr_14.7fr] md:items-center";

/** The line box plus the remove button column beside it. */
export const CART_ROW = "grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-x-3";

interface CartLineItemsProps {
  lines: CartLine[];
}

export function CartLineItems({ lines }: CartLineItemsProps) {
  const keys = getLineRowKeys(lines);
  return (
    <ul className="grid gap-3.5" aria-label="Cart items">
      {lines.map((line, index) => (
        <CartLineItem key={keys[index]} item={line} />
      ))}
    </ul>
  );
}

// Shopify replaces a new line's `optimistic:` ID on confirmation, so rows key by the identity Hydrogen matches lines on.
function getLineRowKeys(lines: CartLine[]) {
  const keys = lines.map((line) =>
    JSON.stringify([
      line.merchandise?.id ?? line.id,
      line.sellingPlanAllocation?.sellingPlan.id ?? null,
      (line.attributes ?? []).map(({ key, value }) => JSON.stringify([key, value])).sort(),
    ]),
  );
  return keys.map((key, index) =>
    keys.indexOf(key) === keys.lastIndexOf(key) ? key : lines[index].id,
  );
}

interface CartLineItemProps {
  item: CartLine;
}

function CartLineItem({ item }: CartLineItemProps) {
  const isPending = useCart((state) => state.pending.lines.has(item.id));
  const isCostPending = useCart((state) =>
    Boolean(state.pending.cost || state.revalidating || state.pending.lines.has(item.id)),
  );
  const { cost, merchandise, quantity } = item;
  const instructions = "instructions" in item ? item.instructions : undefined;
  const canUpdateQuantity = !(
    instructions &&
    typeof instructions === "object" &&
    "canUpdateQuantity" in instructions &&
    instructions.canUpdateQuantity === false
  );
  const canRemove = !(
    instructions &&
    typeof instructions === "object" &&
    "canRemove" in instructions &&
    instructions.canRemove === false
  );
  const components = (item as HydrogenCartLine).lineComponents ?? [];
  const isOptimistic = item.id.startsWith("optimistic:");
  const currencyCode = cost.totalAmount.currencyCode;
  const finalUnitPrice = quantity > 0 ? Number(cost.totalAmount.amount) / quantity : 0;
  const sellingUnitPrice = Number(cost.amountPerQuantity.amount);
  const compareAtUnitPrice = Number(cost.compareAtAmountPerQuantity?.amount ?? 0);
  const originalUnitPrice =
    finalUnitPrice < sellingUnitPrice ? sellingUnitPrice : compareAtUnitPrice;
  const title = merchandise?.product.title || "Cart item";
  const variantLabel = merchandise?.selectedOptions?.length
    ? merchandise.selectedOptions
        .filter((option) => option.value !== "Default Title")
        .map((option) => option.value)
        .join(" / ")
    : "";
  const lineName = variantLabel ? `${title}, ${variantLabel}` : title;
  const href = merchandise?.product.handle ? `/products/${merchandise.product.handle}` : undefined;
  const image = merchandise?.image;
  const price = (amount: number) => formatPrice({ amount: String(amount), currencyCode });
  const isPriceUnknown = isCostPending || !currencyCode;

  const unitPrice = isPriceUnknown ? (
    <span className="text-muted-foreground">Updating…</span>
  ) : (
    <>
      {price(finalUnitPrice)}
      {originalUnitPrice > finalUnitPrice ? (
        <span className="ml-2 text-sm text-muted-foreground line-through">
          {price(originalUnitPrice)}
        </span>
      ) : null}
    </>
  );

  const thumbnail = (
    <span className="relative block size-13 shrink-0 overflow-hidden rounded-sm bg-muted">
      {image?.url ? (
        <Image
          alt={image.altText || title}
          className="object-cover"
          fill
          sizes="52px"
          src={image.url}
        />
      ) : (
        <ImagePlaceholder className="size-full" />
      )}
    </span>
  );

  return (
    <li aria-busy={isPending || undefined} aria-label={title} className="grid gap-2">
      <CartLineForm className={CART_ROW} lineId={item.id} minQuantity={canRemove ? 0 : 1}>
        {(register) => (
          <>
            <div
              className={cn(
                "grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border border-foreground/80 p-4 md:min-h-25 md:px-9",
                CART_COLUMNS,
              )}
            >
              <div className="col-span-2 flex min-w-0 items-center gap-4 md:col-span-1">
                {href ? (
                  <Link className="transition-opacity hover:opacity-80" href={href} tabIndex={-1}>
                    {thumbnail}
                  </Link>
                ) : (
                  thumbnail
                )}
                <div className="grid min-w-0 gap-0.5">
                  <h3 className="line-clamp-2 text-base">
                    {href ? (
                      <Link className="transition-opacity hover:opacity-75" href={href}>
                        {title}
                      </Link>
                    ) : (
                      title
                    )}
                  </h3>
                  {variantLabel ? (
                    <p className="text-sm text-muted-foreground">{variantLabel}</p>
                  ) : null}
                  {item.sellingPlanAllocation ? (
                    <p className="text-sm text-muted-foreground">
                      {item.sellingPlanAllocation.sellingPlan.name || "Subscription"}
                    </p>
                  ) : null}
                  {components.length ? (
                    <ul className="grid gap-0.5 text-xs text-muted-foreground">
                      {components.map((component) => (
                        <li key={component.id}>
                          {component.merchandise?.product.title || "Bundle item"}
                          {component.quantity > 1 ? ` ×${component.quantity}` : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-sm tabular-nums md:hidden">{unitPrice}</p>
                </div>
              </div>

              <p className="hidden tabular-nums md:block">
                <span className="sr-only">Price: </span>
                {unitPrice}
              </p>

              <div
                aria-label="Item quantity"
                className="flex h-11 w-19 items-center justify-between rounded-md border border-foreground/80 pr-1 pl-3 focus-within:ring-1 focus-within:ring-foreground"
                role="group"
              >
                <input
                  key={quantity}
                  {...register("quantity", {
                    interactive: true,
                    value: String(quantity).padStart(2, "0"),
                  })}
                  aria-label={`Quantity: ${lineName}`}
                  className="w-8 bg-transparent text-base tabular-nums outline-none disabled:cursor-not-allowed"
                  disabled={isOptimistic || !canUpdateQuantity}
                  max={99}
                  min={canRemove ? 0 : 1}
                />
                <div className="grid">
                  <button
                    {...register("increase")}
                    aria-label={`Increase quantity: ${lineName}`}
                    className="grid h-4.5 w-6 cursor-pointer place-items-center rounded-sm hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isOptimistic || !canUpdateQuantity || quantity >= 99}
                    type="submit"
                  >
                    <ChevronUp aria-hidden className="size-3.5" />
                  </button>
                  <button
                    {...register("decrease")}
                    aria-label={`Decrease quantity: ${lineName}`}
                    className="grid h-4.5 w-6 cursor-pointer place-items-center rounded-sm hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isOptimistic || !canUpdateQuantity || quantity <= 1}
                    type="submit"
                  >
                    <ChevronDown aria-hidden className="size-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-right tabular-nums">
                <span className="sr-only">Subtotal: </span>
                {isPriceUnknown ? (
                  <span className="text-muted-foreground">Updating…</span>
                ) : (
                  formatPrice(cost.totalAmount)
                )}
              </p>
            </div>

            <button
              {...register("remove")}
              aria-label={`Remove item: ${lineName}`}
              className="grid size-10 cursor-pointer place-items-center rounded-md text-foreground transition-colors hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isOptimistic || !canRemove}
              type="submit"
            >
              <Trash2 aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </CartLineForm>
      <CartWarnings lineId={item.id} />
    </li>
  );
}
