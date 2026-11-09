import { cacheLife, cacheTag } from "next/cache";

import type { CommerceLocale } from "@/lib/config/types";
import type { ContentPage, ContentPageLink } from "@/lib/pages/types";
import { fetchPage, fetchPages } from "@/lib/shopify/operations/pages/server";

export async function getPage(params: {
  handle: string;
  locale?: CommerceLocale;
}): Promise<ContentPage | undefined> {
  "use cache: remote";
  cacheLife("max");
  cacheTag("pages", `page-${params.handle}`);

  return fetchPage(params);
}

export async function getPages(
  params: { locale?: CommerceLocale } = {},
): Promise<ContentPageLink[]> {
  "use cache: remote";
  cacheLife("max");
  cacheTag("pages");

  return fetchPages(params);
}
