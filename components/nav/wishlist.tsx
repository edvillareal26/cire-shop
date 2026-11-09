import { Heart } from "lucide-react";
import type { ReactNode } from "react";

import { Link } from "@/components/ui/link";
import { formatCount } from "@/lib/content";
import { getWishlistIds } from "@/lib/wishlist/server";

export async function WishlistIcon() {
  const count = (await getWishlistIds()).length;
  return (
    <WishlistIconFrame>
      <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-badge px-1 text-xxs leading-none text-cream tabular-nums">
        {count}
        <span className="sr-only">{`, ${formatCount(count, "saved product")}`}</span>
      </span>
    </WishlistIconFrame>
  );
}

export function WishlistIconFallback() {
  return <WishlistIconFrame />;
}

function WishlistIconFrame({ children }: { children?: ReactNode }) {
  return (
    <Link
      className="relative hidden p-1 transition-opacity hover:opacity-75 sm:block"
      href="/wishlist"
    >
      <Heart className="size-5" />
      <span className="sr-only">Wishlist</span>
      {children}
    </Link>
  );
}
