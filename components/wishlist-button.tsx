"use client";

import { useFormStatus } from "react-dom";
import { toggleWishlist } from "@/app/(site)/wishlist/actions";
import { HeartIcon } from "@/components/icons";

export function WishlistButton({
  productId,
  saved,
  variant = "icon",
}: {
  productId: string;
  saved: boolean;
  variant?: "icon" | "text";
}) {
  return (
    <form action={toggleWishlist}>
      <input type="hidden" name="productId" value={productId} />
      <Submit saved={saved} variant={variant} />
    </form>
  );
}

function Submit({
  saved,
  variant,
}: {
  saved: boolean;
  variant: "icon" | "text";
}) {
  const { pending } = useFormStatus();
  // Show the state the user asked for while the request is in flight.
  const showSaved = pending ? !saved : saved;
  const label = saved ? "Remove from wishlist" : "Add to wishlist";

  if (variant === "text") {
    return (
      <button
        type="submit"
        disabled={pending}
        className="text-muted hover:text-foreground font-sans text-[11px] tracking-[0.18em] uppercase underline-offset-4 hover:underline disabled:opacity-50"
      >
        {saved ? "Remove" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      aria-pressed={saved}
      title={label}
      className="border-foreground/30 hover:border-foreground grid size-12 shrink-0 place-items-center border transition-colors disabled:opacity-60"
    >
      <HeartIcon
        className={`size-5 ${showSaved ? "fill-badge text-badge" : ""}`}
      />
    </button>
  );
}
