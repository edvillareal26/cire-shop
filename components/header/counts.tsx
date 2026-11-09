import { getCartById, getCartId } from "@/lib/cart";
import { getWishlistIds } from "@/lib/wishlist";

function Badge({ count, noun }: { count: number; noun: string }) {
  return (
    <span className="bg-badge text-cream absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full px-1 font-sans text-[10px] leading-none tabular-nums">
      <span className="sr-only">, </span>
      {count}
      <span className="sr-only">
        {" "}
        {noun}
        {count === 1 ? "" : "s"}
      </span>
    </span>
  );
}

export async function CartCount() {
  const cartId = await getCartId();
  // The header must never take the page down, so a failed lookup shows 0.
  const cart = cartId ? await getCartById(cartId).catch(() => null) : null;
  return <Badge count={cart?.totalQuantity ?? 0} noun="item" />;
}

export async function WishlistCount() {
  const ids = await getWishlistIds();
  return <Badge count={ids.length} noun="saved product" />;
}
