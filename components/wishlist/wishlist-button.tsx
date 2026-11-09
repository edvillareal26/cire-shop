"use client";

import { cn } from "cn";
import { Heart } from "lucide-react";
import { useOptimistic, useTransition } from "react";

import { toggleWishlistAction } from "@/lib/wishlist/action";

interface WishlistButtonProps {
  className?: string;
  productId: string;
  saved: boolean;
  variant?: "icon" | "text";
}

export function WishlistButton({
  className,
  productId,
  saved,
  variant = "icon",
}: WishlistButtonProps) {
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(saved);
  const [pending, startTransition] = useTransition();
  const label = optimisticSaved ? "Remove from wishlist" : "Add to wishlist";

  function toggle() {
    startTransition(async () => {
      setOptimisticSaved(!optimisticSaved);
      await toggleWishlistAction(productId);
    });
  }

  if (variant === "text") {
    return (
      <button
        className={cn(
          "cursor-pointer text-xs uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        disabled={pending}
        onClick={toggle}
        type="button"
      >
        {optimisticSaved ? "Remove" : "Save"}
      </button>
    );
  }

  return (
    <button
      aria-label={label}
      aria-pressed={optimisticSaved}
      className={cn(
        "grid size-12 shrink-0 cursor-pointer place-items-center border border-foreground/30 transition-colors hover:border-foreground disabled:cursor-not-allowed",
        className,
      )}
      disabled={pending}
      onClick={toggle}
      title={label}
      type="button"
    >
      <Heart className={cn("size-5", optimisticSaved && "fill-badge text-badge")} />
    </button>
  );
}
