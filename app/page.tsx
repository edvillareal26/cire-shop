import type { Metadata } from "next";
import Image from "next/image";

import { CireInsider } from "@/components/home/cire-insider";
import { ShopTheEssentials } from "@/components/home/shop-the-essentials";
import { TheCireSet } from "@/components/home/the-cire-set";
import { CireStandard, ToolsComingSoon } from "@/components/home/tools-and-standard";
import { FullPage } from "@/components/layout/full-page";
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
    <Page className="theme-cream bg-background py-0 text-foreground lg:py-0">
      <Hero />
      <ShopTheEssentials />
      {/* The Tools photo is banner-sized, too small to fill a screen alone, so it shares one with The Cire Standard. */}
      <div className="grid min-h-section grid-rows-[auto_1fr]" data-full-page-section>
        <ToolsComingSoon />
        <CireStandard />
      </div>
      <TheCireSet />
      <CireInsider />
      <FullPage />
    </Page>
  );
}

function Hero() {
  return (
    <section
      className="relative isolate -mt-19 flex h-[calc(100svh-2.25rem)] min-h-150 overflow-hidden bg-olive-deep text-cream"
      data-full-page-section
    >
      <Image
        alt=""
        className="-z-10 object-cover"
        fill
        placeholder="blur"
        preload
        src={heroImage}
        unoptimized
      />
      {/* The hero photo carries its own lettering, so the page heading stays off-screen. */}
      <h1 className="sr-only">Perfect the ritual.</h1>
    </section>
  );
}
