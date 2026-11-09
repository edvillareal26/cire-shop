import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichPage } from "@/components/rich-page";
import { getPage, getPages } from "@/lib/shopify";

// Pages created in Shopify admin (Online Store → Pages), e.g. Contact.
export async function generateStaticParams() {
  const pages = await getPages();
  // Cache Components requires at least one entry.
  if (pages.length === 0) return [{ handle: "__none__" }];
  return pages.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/pages/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo.title || page.title,
    description: page.seo.description || page.bodySummary || undefined,
  };
}

export default async function ShopifyPage({
  params,
}: PageProps<"/pages/[handle]">) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();
  return <RichPage title={page.title} html={page.body} />;
}
