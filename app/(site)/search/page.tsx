import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { Container, PageHero } from "@/components/container";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { searchProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

type SearchParams = PageProps<"/search">["searchParams"];

function readQuery(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 100) ?? "";
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <PageHero eyebrow="Find your essentials" title="Search">
        <Suspense fallback={<SearchForm />}>
          <SearchFormWithQuery searchParams={searchParams} />
        </Suspense>
      </PageHero>
      <Container className="py-14 sm:py-20">
        <Suspense fallback={<ProductGridSkeleton />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function SearchFormWithQuery({ searchParams }: { searchParams: SearchParams }) {
  const query = readQuery((await searchParams).q);
  return <SearchForm defaultValue={query} />;
}

function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <Form
      action="/search"
      role="search"
      className="border-cream/60 focus-within:border-cream mt-8 flex max-w-xl border-b"
    >
      <label htmlFor="q" className="sr-only">
        Search products
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        key={defaultValue}
        placeholder="Lash extensions, adhesive, primer…"
        className="placeholder:text-cream/45 min-w-0 flex-1 bg-transparent py-3 font-serif text-2xl outline-none"
      />
      <button
        type="submit"
        className="font-sans text-xs tracking-[0.24em] uppercase hover:opacity-75"
      >
        Search
      </button>
    </Form>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const query = readQuery((await searchParams).q);
  if (!query) {
    return (
      <p className="text-muted">Search by product name or category.</p>
    );
  }

  const products = await searchProducts(query);
  return (
    <>
      <p className="text-muted mb-10 font-sans text-xs tracking-[0.12em]">
        {products.length} {products.length === 1 ? "result" : "results"} for “
        {query}”
      </p>
      {products.length > 0 ? (
        <ProductGrid products={products} eagerFirst={4} />
      ) : (
        <p className="text-muted">
          Nothing matched your search. Try a different word, or{" "}
          <Link href="/shop" className="text-foreground underline underline-offset-4">
            browse the shop
          </Link>
          .
        </p>
      )}
    </>
  );
}
