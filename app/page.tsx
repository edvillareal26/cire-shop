import type { Metadata } from "next";
import Image from "next/image";

import { CireInsider } from "@/components/home/cire-insider";
import { ShopTheEssentials } from "@/components/home/shop-the-essentials";
import { TheCireSet } from "@/components/home/the-cire-set";
import { CireStandard, ToolsComingSoon } from "@/components/home/tools-and-standard";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { shopConfig } from "@/lib/config";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import heroImage from "@/public/images/hero.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Perfect the ritual";
  const description = shopConfig.site.description;
  return {
    alternates: buildAlternates({ pathname: "/" }),
    description,
    openGraph: buildOpenGraph({ description, title, type: "website", url: "/" }),
    title: `${shopConfig.site.name} | ${title}`,
  };
}

export default function HomePage() {
  return (
    // Home sections set their own colors; the cream theme keeps focus rings visible on the light ones.
    <Page className="theme-cream bg-background pt-0 text-foreground">
      <Hero />
      <ShopTheEssentials />
      <ToolsComingSoon />
      <CireStandard />
      <TheCireSet />
      <CireInsider />
    </Page>
  );
}

function Hero() {
  return (
    <section className="relative isolate -mt-19 flex h-[calc(100svh-2.25rem)] max-h-225 min-h-150 overflow-hidden bg-olive-deep text-cream">
      <Image
        alt=""
        className="-z-10 object-cover object-[88%_center] lg:object-right"
        fill
        placeholder="blur"
        preload
        src={heroImage}
        unoptimized
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-olive-deep/80 via-olive-deep/40 to-transparent lg:hidden" />
      <div className="mx-auto flex w-full max-w-360 flex-col justify-center px-6 pt-19 sm:px-12 lg:px-[9.8%]">
        <h1 className="font-serif text-[clamp(3.5rem,7vw,6.25rem)] leading-[0.95] font-light italic">
          Perfect
          <br />
          the ritual.
        </h1>
        <p className="mt-6 font-serif text-base uppercase tracking-[0.12em] sm:text-lg">
          Premium lash essentials
          <br />
          for a higher standard
        </p>
        <Link
          className="mt-10 inline-flex w-fit items-center border border-cream/85 px-7 py-3.5 text-[13px] uppercase tracking-[0.24em] transition-colors hover:bg-cream hover:text-olive-deep sm:ml-13"
          href="/collections/all"
        >
          Shop now
        </Link>
      </div>
      <div className="absolute inset-x-0 bottom-12 mx-auto flex max-w-360 items-center justify-between px-6 text-[11px] uppercase tracking-[0.26em] sm:px-9 sm:text-xs">
        <p className="hidden items-center gap-4 sm:flex">
          <span className="h-px w-24 bg-cream/70" />
          Notice the detail
        </p>
        <a
          aria-label="Scroll to Shop the Essentials"
          className="absolute left-1/2 grid h-14 w-9 -translate-x-1/2 place-items-center rounded-full border border-cream/70 hover:border-cream"
          href="#essentials"
        >
          <svg
            className="h-5 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 12 22"
          >
            <path d="m1.5 2 4.5 4 4.5-4M1.5 8.5l4.5 4 4.5-4M1.5 15l4.5 4 4.5-4" />
          </svg>
        </a>
        <p className="ml-auto hidden sm:block lg:mr-[10%]">Look closer</p>
      </div>
    </section>
  );
}
