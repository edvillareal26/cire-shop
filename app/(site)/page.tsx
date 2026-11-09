import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/shopify";
import heroImage from "@/public/images/hero.jpg";

export default async function Home() {
  const products = await getProducts({ first: 8, sortKey: "BEST_SELLING" });

  return (
    <>
      <section className="bg-olive-deep text-cream relative isolate flex h-[calc(100svh-2.25rem)] max-h-[900px] min-h-[600px] overflow-hidden">
        {/* Full-bleed photo: the olive backdrop on its left carries the text. */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImage}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            // On tall screens the cover crop renders the photo ~2.2× the
            // viewport height wide, so ask for a file that large.
            sizes="(orientation: portrait) 220vh, 100vw"
            className="object-cover object-[88%_center] lg:object-right"
          />
          {/* On narrow screens the text overlaps the model, so darken it. */}
          <div className="from-olive-deep/80 via-olive-deep/40 absolute inset-0 bg-gradient-to-r to-transparent lg:hidden" />
        </div>

        <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 pt-(--header-h) sm:px-12 lg:px-[9.8%]">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.25rem)] leading-[0.95] font-light italic">
            Perfect
            <br />
            the ritual.
          </h1>
          <p className="mt-6 font-serif text-base tracking-[0.12em] uppercase sm:text-lg">
            Premium lash essentials
            <br />
            for a higher standard
          </p>
          <Link
            href="/shop"
            className="border-cream/85 hover:bg-cream hover:text-olive-deep mt-10 inline-flex w-fit items-center border px-7 py-3.5 font-sans text-[13px] tracking-[0.24em] uppercase transition-colors sm:ml-[3.25rem]"
          >
            Shop now
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-12 mx-auto flex max-w-[1440px] items-center justify-between px-6 font-sans text-[11px] tracking-[0.26em] uppercase sm:px-9 sm:text-xs">
          <p className="hidden items-center gap-4 sm:flex">
            <span className="bg-cream/70 h-px w-24" />
            Notice the detail
          </p>
          <a
            href="#collection"
            aria-label="Scroll to the collection"
            className="border-cream/70 hover:border-cream absolute left-1/2 grid h-14 w-9 -translate-x-1/2 place-items-center rounded-full border"
          >
            <svg viewBox="0 0 12 22" className="h-5 w-3" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="m1.5 2 4.5 4 4.5-4M1.5 8.5l4.5 4 4.5-4M1.5 15l4.5 4 4.5-4" />
            </svg>
          </a>
          <p className="ml-auto hidden sm:block lg:mr-[10%]">Look closer</p>
        </div>
      </section>

      <section id="collection" className="scroll-mt-(--header-h) py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-muted mb-3 font-sans text-[11px] tracking-[0.28em] uppercase">
                Notice the detail
              </p>
              <h2 className="font-serif text-4xl font-light italic sm:text-5xl">
                The Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-sans text-xs tracking-[0.22em] uppercase underline-offset-4 hover:underline"
            >
              Shop all →
            </Link>
          </div>
          <ProductGrid products={products} />
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-28">
        <Container className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <h2 className="font-serif text-4xl leading-tight font-light italic sm:text-5xl">
            Designed for precision.
            <br />
            Created for the detail.
          </h2>
          <div>
            <p className="text-muted leading-relaxed">
              Cire Lash Collection makes professional lash essentials (lash
              extensions, adhesives, bonders and primers) for artists who value
              consistency, softness and precision in every set.
            </p>
            <Link
              href="/about"
              className="border-foreground/70 hover:bg-foreground hover:text-cream mt-8 inline-flex border px-7 py-3.5 font-sans text-[13px] tracking-[0.24em] uppercase transition-colors"
            >
              Our story
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
