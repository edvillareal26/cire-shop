import { cn } from "cn";
import type { ComponentProps } from "react";

import { Price } from "@/components/product/price";
import { isMarkedDown } from "@/lib/product";

interface ProductPriceProps extends ComponentProps<"div"> {
  amount: string;
  currencyCode: string;
  compareAtAmount?: string;
}

export function ProductPrice({
  amount,
  currencyCode,
  compareAtAmount,
  className,
  ...props
}: ProductPriceProps) {
  const markedDown = isMarkedDown(amount, compareAtAmount);
  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-1", className)} {...props}>
      {markedDown && compareAtAmount ? (
        <span>
          <span className="sr-only">Regular price </span>
          <Price
            amount={compareAtAmount}
            className="text-lg tracking-normal text-muted-foreground line-through"
            currencyCode={currencyCode}
          />
        </span>
      ) : null}
      <span>
        {markedDown ? <span className="sr-only">Sale price </span> : null}
        <Price
          amount={amount}
          className="text-[1.75rem] leading-none font-medium tracking-normal"
          currencyCode={currencyCode}
        />
      </span>
    </div>
  );
}
