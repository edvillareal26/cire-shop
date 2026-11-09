import type { Money } from "@/lib/shopify/types";
import { formatMoney, isDiscounted } from "@/lib/utils";

export function Price({
  amount,
  compareAt,
  prefix,
  className = "",
}: {
  amount: Money;
  compareAt?: Money | null;
  prefix?: string;
  className?: string;
}) {
  const onSale = isDiscounted(amount, compareAt);
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={onSale ? "text-danger" : undefined}>
        {prefix ? `${prefix} ` : null}
        {formatMoney(amount)}
      </span>
      {onSale && compareAt ? (
        <s className="text-muted text-[0.9em]">
          <span className="sr-only">Regular price </span>
          {formatMoney(compareAt)}
        </s>
      ) : null}
    </span>
  );
}
