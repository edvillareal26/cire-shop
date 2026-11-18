import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { preload } from "react-dom";

import { CireInsider } from "@/components/home/cire-insider";
import { ShopTheEssentials } from "@/components/home/shop-the-essentials";
import { TheCireSet } from "@/components/home/the-cire-set";
import { CireStandard, ToolsComingSoon } from "@/components/home/tools-and-standard";
import { FullPage } from "@/components/layout/full-page";
import { Page } from "@/components/ui/page";
import { shopConfig } from "@/lib/config";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import heroLandscape from "@/public/images/hero-landscape.jpg";
import heroPortrait from "@/public/images/hero-portrait.jpg";

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

const HERO_LANDSCAPE = "(orientation: landscape)";
const HERO_PORTRAIT = "(orientation: portrait)";

// Portrait screens get a tall version of the hero so the whole product lineup stays in view.
function Hero() {
  const common = {
    alt: "Cire Lash Collection box with Lash Primer, Signature Bond, and Super Bonder on travertine",
    fill: true,
    sizes: "100vw",
    unoptimized: true,
  } as const;
  const { props: landscape } = getImageProps({ ...common, src: heroLandscape });
  const { props: portrait } = getImageProps({
    ...common,
    fetchPriority: "high",
    loading: "eager",
    src: heroPortrait,
  });
  preload(landscape.src, { as: "image", fetchPriority: "high", media: HERO_LANDSCAPE });
  preload(portrait.src, { as: "image", fetchPriority: "high", media: HERO_PORTRAIT });

  return (
    <section
      className="relative isolate -mt-19 flex h-[calc(100svh-2.25rem)] min-h-150 overflow-hidden bg-olive-deep text-cream"
      data-full-page-section
    >
      <picture>
        <source media={HERO_LANDSCAPE} srcSet={landscape.src} />
        <img {...portrait} className="-z-10 object-cover" />
      </picture>
      {/* The hero photo carries its own lettering, so the page heading stays off-screen. */}
      <h1 className="sr-only">Perfect the ritual.</h1>
    </section>
  );
}
