import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container, PageHero } from "@/components/container";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { getCollection, getCollections } from "@/lib/shopify";

// Prerender every collection at build time; new ones are generated on first visit.
export async function generateStaticParams() {
  const collections = await getCollections();
  // Cache Components requires at least one entry; a store with no collections
  // still needs a placeholder, which resolves to the 404 page.
  if (collections.length === 0) return [{ handle: "__none__" }];
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description || undefined,
  };
}

export default function CollectionPage({
  params,
}: PageProps<"/collections/[handle]">) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

async function CollectionContent({
  params,
}: Pick<PageProps<"/collections/[handle]">, "params">) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();

  return (
    <>
      <PageHero eyebrow="Collection" title={collection.title}>
        {collection.description ? (
          <p className="text-cream/75 mt-4 max-w-xl">{collection.description}</p>
        ) : null}
      </PageHero>
      <Container className="py-14 sm:py-20">
        <ProductGrid products={collection.products.nodes} eagerFirst={4} />
      </Container>
    </>
  );
}

function CollectionSkeleton() {
  return (
    <>
      <PageHero eyebrow="Collection" title="…" />
      <Container className="py-14 sm:py-20">
        <ProductGridSkeleton />
      </Container>
    </>
  );
}
