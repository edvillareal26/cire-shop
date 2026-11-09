"use client";

import { ShoppingCart } from "lucide-react";

import { Link } from "@/components/ui/link";
import { useCart } from "@/lib/cart/client";

interface CartIconClientProps {
  cartLabel: string;
  initialCart: { totalQuantity: number } | null;
}

export function CartIconClient({ cartLabel, initialCart }: CartIconClientProps) {
  const quantity = useCart((state) =>
    state.loading
      ? (initialCart?.totalQuantity ?? state.data.totalQuantity)
      : state.data.totalQuantity,
  );

  return (
    <Link
      className="flex items-center justify-center gap-1.5 p-1 text-foreground transition-opacity hover:opacity-75"
      href="/cart"
    >
      <span className="relative">
        <ShoppingCart className="size-5" />
        <span className="absolute -top-2.5 -right-3 grid h-4 min-w-4 place-items-center rounded-full bg-badge px-1 text-xxs leading-none text-cream tabular-nums">
          {quantity}
        </span>
      </span>
      <span className="sr-only">{cartLabel}</span>
    </Link>
  );
}
