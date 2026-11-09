"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { CART_COOKIE, CART_COOKIE_OPTIONS } from "@/lib/cart";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  ShopifyUserError,
  updateCartLines,
} from "@/lib/shopify";

export type CartActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const MAX_QUANTITY = 999;

function parseQuantity(
  value: FormDataEntryValue | null,
  { min, fallback }: { min: number; fallback: number },
): number {
  const n = Number.parseInt(typeof value === "string" ? value : "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), MAX_QUANTITY);
}

function toMessage(error: unknown): string {
  if (error instanceof ShopifyUserError) return error.message;
  console.error(error);
  return "Something went wrong updating your cart. Please try again.";
}

export async function addToCart(
  _prev: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const merchandiseId = formData.get("merchandiseId");
  if (
    typeof merchandiseId !== "string" ||
    !merchandiseId.startsWith("gid://shopify/ProductVariant/")
  ) {
    return { status: "error", message: "Please choose an available option." };
  }
  const quantity = parseQuantity(formData.get("quantity"), {
    min: 1,
    fallback: 1,
  });
  const lines = [{ merchandiseId, quantity }];

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;
    // A cart that expired or was already checked out comes back as null.
    const existing = cartId ? await getCart(cartId) : null;

    if (existing) {
      await addCartLines(existing.id, lines);
    } else {
      const cart = await createCart(lines);
      cookieStore.set(CART_COOKIE, cart.id, CART_COOKIE_OPTIONS);
    }
  } catch (error) {
    return { status: "error", message: toMessage(error) };
  }

  refresh(); // re-render the page so the header's cart count updates
  return { status: "success", message: "Added to cart" };
}

/** Sets a line's quantity; a quantity of 0 removes the line. */
export async function updateCartLine(
  _prev: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const lineId = formData.get("lineId");
  if (typeof lineId !== "string" || !lineId) {
    return { status: "error", message: "Unknown cart item." };
  }
  const quantity = parseQuantity(formData.get("quantity"), {
    min: 0,
    fallback: 0,
  });

  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return { status: "error", message: "Your cart has expired." };

  try {
    if (quantity === 0) {
      await removeCartLines(cartId, [lineId]);
    } else {
      await updateCartLines(cartId, [{ id: lineId, quantity }]);
    }
  } catch (error) {
    return { status: "error", message: toMessage(error) };
  }

  refresh();
  return { status: "idle" };
}
