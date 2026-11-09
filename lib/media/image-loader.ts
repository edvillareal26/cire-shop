import type { ImageLoaderProps } from "next/image";

const SHOPIFY_CDN = "https://cdn.shopify.com/";

/**
 * Shopify's CDN resizes images and serves AVIF or WebP to each browser, so Shopify images load
 * from it directly at the requested width. Routed through Next's optimizer instead, a
 * multi-megabyte product PNG can take longer than the optimizer's fixed 7-second download limit
 * and fail to display.
 *
 * Next's optimizer route is off under a custom loader, so local images in `public/` are small
 * files rendered with `unoptimized`; any other source is returned unchanged.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  if (!src.startsWith(SHOPIFY_CDN)) return src;
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
