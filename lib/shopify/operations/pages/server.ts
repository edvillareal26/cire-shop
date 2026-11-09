import { gql } from "@shopify/hydrogen";

import { shopConfig } from "@/lib/config";
import type { CommerceLocale } from "@/lib/config/types";
import type { ContentPage, ContentPageLink } from "@/lib/pages/types";
import { assertStorefrontOk } from "@/lib/shopify/errors/server";
import { sanitizeShopifyHtml } from "@/lib/shopify/html/server";
import { storefront } from "@/lib/shopify/storefront/server";

const GET_PAGE_QUERY = gql(`#graphql
  query getPage($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      body
      bodySummary
      handle
      seo {
        description
        title
      }
      title
    }
  }
`);

export async function fetchPage({
  handle,
  locale = shopConfig.localization,
}: {
  handle: string;
  locale?: CommerceLocale;
}): Promise<ContentPage | undefined> {
  const response = await storefront.request(GET_PAGE_QUERY, { locale, variables: { handle } });
  assertStorefrontOk(response, "getPage");

  const page = response.data.page;
  if (!page) return undefined;

  return {
    body: sanitizeShopifyHtml(page.body),
    handle: page.handle,
    seo: {
      description: page.seo?.description ?? page.bodySummary,
      title: page.seo?.title ?? page.title,
    },
    title: page.title,
  };
}

const GET_PAGES_QUERY = gql(`#graphql
  query getPages($first: Int!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    pages(first: $first) {
      nodes {
        handle
        title
      }
    }
  }
`);

export async function fetchPages({
  locale = shopConfig.localization,
}: {
  locale?: CommerceLocale;
} = {}): Promise<ContentPageLink[]> {
  const response = await storefront.request(GET_PAGES_QUERY, { locale, variables: { first: 50 } });
  assertStorefrontOk(response, "getPages");

  return response.data.pages.nodes.map(({ handle, title }) => ({ handle, title }));
}
