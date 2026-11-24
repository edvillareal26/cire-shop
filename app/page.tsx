import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { preload } from "react-dom";

import { CireInsider } from "@/components/home/cire-insider";
import { ShopTheEssentials } from "@/components/home/shop-the-essentials";
import { TheCireSet } from "@/components/home/the-cire-set";
import { CireStandard, ToolsComingSoon } from "@/components/home/tools-and-standard";
import { FullPage } from "@/components/layout/full-page";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { shopConfig } from "@/lib/config";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import heroLandscapeAvif from "@/public/images/hero-landscape.avif";
import heroLandscape from "@/public/images/hero-landscape.jpg";
import heroPortraitAvif from "@/public/images/hero-portrait.avif";
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

// Portrait screens get a tall version of the hero with the products at the bottom and open wall above for the copy.
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
  const avif = { as: "image", fetchPriority: "high", type: "image/avif" } as const;
  preload(heroLandscapeAvif.src, { ...avif, media: HERO_LANDSCAPE });
  preload(heroPortraitAvif.src, { ...avif, media: HERO_PORTRAIT });

  return (
    <section
      className="relative isolate -mt-19 flex h-[calc(100svh-2.25rem)] min-h-150 overflow-hidden bg-olive-deep text-cream"
      data-full-page-section
    >
      <picture>
        {/* Each AVIF is a sharpened, larger copy of the JPEG beside it; replace both together. */}
        <source media={HERO_LANDSCAPE} srcSet={heroLandscapeAvif.src} type="image/avif" />
        <source media={HERO_LANDSCAPE} srcSet={landscape.src} />
        <source srcSet={heroPortraitAvif.src} type="image/avif" />
        <img {...portrait} className="-z-10 object-cover object-bottom landscape:object-right" />
      </picture>
      {/* The portrait photo's products fill a bottom band 66vw tall; the copy centres on the wall above it. */}
      <div className="mx-auto flex w-full max-w-360 flex-col justify-center px-6 pt-19 portrait:pb-[66vw] sm:px-12 lg:px-[9.8%]">
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
          href="/shop"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
