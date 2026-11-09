"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

import { CartProvider } from "@/lib/cart/client";

/**
 * The cart lives on its own page (no drawer). Adding to cart goes there straight away: the cart
 * store sits in the root layout, so the new line shows optimistically while Shopify confirms it.
 */
export function useOpenCart() {
  const router = useRouter();
  return () => router.push("/cart");
}

interface CartProviderWrapperProps {
  cartData: ComponentProps<typeof CartProvider>["initialData"];
  children: ReactNode;
}

export function CartProviderWrapper({ cartData, children }: CartProviderWrapperProps) {
  return <CartProvider initialData={cartData}>{children}</CartProvider>;
}
