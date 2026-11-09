import { getWishlistIds } from "@/lib/wishlist/server";

import { WishlistButton } from "./wishlist-button";

interface ProductWishlistToggleProps {
  className?: string;
  productId: string;
}

export async function ProductWishlistToggle({ className, productId }: ProductWishlistToggleProps) {
  const ids = await getWishlistIds();
  return (
    <WishlistButton className={className} productId={productId} saved={ids.includes(productId)} />
  );
}
