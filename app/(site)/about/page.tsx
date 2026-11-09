import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, PageHero } from "@/components/container";
import { getPage, getProducts } from "@/lib/shopify";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");
  return {
    title: page?.seo.title || "About",
    description:
      page?.seo.description ||
      "Premium lash essentials for a higher standard.",
  };
}

// Create a page with the handle "about" in Shopify admin (Online Store →
// Pages) to replace the default copy below.
const PILLARS = [
  {
    title: "Precision",
    body: "Clean definition and seamless application, set after set.",
  },
  {
    title: "Consistency",
    body: "Essentials you can rely on in every appointment.",
  },
  {
    title: "Softness",
    body: "A refined finish that looks and feels effortless.",
  },
];

export default async function AboutPage() {
  const [page, products] = await Promise.all([
    getPage("about"),
    getProducts({ first: 1, sortKey: "BEST_SELLING" }),
  ]);
  const image = products[0]?.featuredImage;

  return (
    <>
      <PageHero eyebrow="Our story" title={page?.title ?? "About Cire"} />

      {page?.body ? (
        <Container className="py-16 sm:py-24">
          <div
            className="rich-text mx-auto max-w-2xl text-[17px]"
            // Authored by the merchant in Shopify admin.
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </Container>
      ) : (
        <>
          <Container className="grid gap-12 py-16 sm:py-24 md:grid-cols-2 md:items-center lg:gap-24">
            <div>
              <h2 className="font-serif text-4xl leading-tight font-light italic sm:text-5xl">
                Perfect the ritual.
                <br />
                Notice the detail.
              </h2>
              <p className="text-muted mt-8 leading-relaxed">
                Cire Lash Collection creates premium lash essentials for a
                higher standard: lash extensions, adhesives, bonders and
                primers, designed for precision and created for the detail.
              </p>
              <p className="text-muted mt-4 leading-relaxed">
                Every product is crafted for lash artists who value
                consistency, softness and precision in every set.
              </p>
            </div>
            {image ? (
              <div className="bg-surface relative aspect-[4/5]">
                <Image
                  src={image.url}
                  alt={image.altText ?? ""}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </Container>

          <section className="bg-surface py-16 sm:py-20">
            <Container>
              <ul className="grid gap-10 sm:grid-cols-3">
                {PILLARS.map((pillar, i) => (
                  <li key={pillar.title}>
                    <p className="text-muted font-sans text-[11px] tracking-[0.28em]">
                      0{i + 1}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl italic">
                      {pillar.title}
                    </h3>
                    <p className="text-muted mt-3 leading-relaxed">
                      {pillar.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        </>
      )}

      <Container className="py-16 text-center sm:py-20">
        <Link
          href="/shop"
          className="border-foreground/70 hover:bg-foreground hover:text-cream inline-flex border px-8 py-3.5 font-sans text-[13px] tracking-[0.24em] uppercase transition-colors"
        >
          Shop the collection
        </Link>
      </Container>
    </>
  );
}
