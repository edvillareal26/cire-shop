import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { RichTextPage } from "@/components/content/rich-text-page";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/skeleton";
import { shopConfig } from "@/lib/config";
import { getPage } from "@/lib/pages/server";
import { getSearchIndexProducts } from "@/lib/product/server";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

const PILLARS = [
  { body: "Clean definition and seamless application, set after set.", title: "Precision" },
  { body: "Essentials you can rely on in every appointment.", title: "Consistency" },
  { body: "A refined finish that looks and feels effortless.", title: "Softness" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage({ handle: "about" });
  const title = page?.seo.title ?? "About";
  const description = page?.seo.description ?? shopConfig.site.description;
  return {
    alternates: buildAlternates({ pathname: "/about" }),
    description,
    openGraph: buildOpenGraph({ description, title, type: "website", url: "/about" }),
    title,
  };
}

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutContent />
    </Suspense>
  );
}

// A Shopify page with the handle "about" replaces the default story below.
async function AboutContent() {
  const page = await getPage({ handle: "about" });
  if (page) return <RichTextPage body={page.body} title={page.title} />;

  const { products } = await getSearchIndexProducts({ limit: 1 });
  const image = products[0]?.featuredImage;

  return (
    <Page>
      <Container className="grid gap-12 pb-16 sm:pb-24 md:grid-cols-2 md:items-center lg:gap-24">
        <div className="grid gap-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Our story</p>
          <h1 className="font-serif text-4xl leading-tight font-light italic sm:text-5xl">
            Perfect the ritual.
            <br />
            Notice the detail.
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Cire Lash Collection creates premium lash essentials for a higher standard: lash
            extensions, adhesives, bonders and primers, designed for precision and created for the
            detail.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Every product is crafted for lash artists who value consistency, softness and precision
            in every set.
          </p>
        </div>
        {image && (
          <div className="relative aspect-4/5 bg-muted">
            <Image
              alt={image.altText}
              className="object-cover"
              fill
              loading="eager"
              sizes="(min-width: 768px) 50vw, 100vw"
              src={image.url}
            />
          </div>
        )}
      </Container>
      <section className="bg-muted py-16 sm:py-20">
        <Container>
          <ul className="grid gap-10 sm:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <li className="grid gap-3" key={pillar.title}>
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground">{`0${index + 1}`}</p>
                <h2 className="font-serif text-3xl italic">{pillar.title}</h2>
                <p className="leading-relaxed text-muted-foreground">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Container className="grid justify-items-center py-16 sm:py-20">
        <Link
          className="inline-flex border border-foreground/70 px-8 py-3.5 text-[13px] uppercase tracking-[0.24em] transition-colors hover:bg-foreground hover:text-background"
          href="/collections/all"
        >
          Shop the collection
        </Link>
      </Container>
    </Page>
  );
}

function AboutSkeleton() {
  return (
    <Page aria-busy="true">
      <Container className="grid gap-12 pb-16 md:grid-cols-2">
        <div className="grid content-start gap-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-24 w-full max-w-md" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="aspect-4/5" />
      </Container>
    </Page>
  );
}
