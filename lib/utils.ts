import type { Money } from "@/lib/shopify/types";

// A fixed locale keeps server and client output identical (no hydration mismatch).
const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney({ amount, currencyCode }: Money): string {
  let formatter = formatters.get(currencyCode);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    });
    formatters.set(currencyCode, formatter);
  }
  return formatter.format(Number(amount));
}

export function isDiscounted(price: Money, compareAt: Money | null | undefined) {
  return !!compareAt && Number(compareAt.amount) > Number(price.amount);
}
