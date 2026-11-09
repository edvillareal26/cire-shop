import Image from "next/image";
import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { CATEGORIES, type Category, getCategoryHref } from "@/lib/categories";
import type { Image as ImageType } from "@/lib/media/types";
import { getFirstProductByType } from "@/lib/product/server";

// Card copy per category; each card opens the shop page filtered to that category.
const DESCRIPTIONS: Record<string, string> = {
  "Lash Adhesives":
    "Our professional lash adhesive, selected with performance and consistency in mind.",
  "Lash Bonder": "Essential for longer lasting retention and a flawless finish.",
  "Lash Extensions":
    "A curated selection of Cire lash trays in essential curls, lengths, thickness, and finishes.",
  "Lash Primer": "Preps natural lashes for optimal adhesion.",
};

const GRID_CLASS = "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4";
const ARCH_CLASS = "relative aspect-3/4 overflow-hidden rounded-t-full bg-cream/10";

export function ShopTheEssentials() {
  return (
    <section
      aria-labelledby="essentials-heading"
      className="scroll-mt-19 bg-olive py-20 text-cream sm:py-28"
      id="essentials"
    >
      <Container className="grid gap-12 sm:gap-16 lg:px-[6%]">
        <div className="grid justify-items-center gap-7">
          <h2
            className="text-center font-serif text-[clamp(1.75rem,2.6vw,2.375rem)] font-light tracking-[0.12em] uppercase"
            id="essentials-heading"
          >
            Shop the Essentials
          </h2>
          <span aria-hidden className="h-px w-12 bg-cream/60" />
        </div>
        <Suspense
          fallback={<EssentialsGrid cards={CATEGORIES.map((category) => toCard(category, null))} />}
        >
          <ResolvedEssentials />
        </Suspense>
      </Container>
    </section>
  );
}

interface EssentialCard {
  description: string;
  href: string;
  image: ImageType | null;
  title: string;
}

function toCard(category: Category, image: ImageType | null): EssentialCard {
  return {
    description: DESCRIPTIONS[category.productType] ?? "",
    href: getCategoryHref(category),
    image,
    title: category.title,
  };
}

// Each arch shows the best-selling product of its category.
async function ResolvedEssentials() {
  const products = await Promise.all(
    CATEGORIES.map((category) => getFirstProductByType({ productType: category.productType })),
  );
  const cards = CATEGORIES.map((category, index) =>
    toCard(category, products[index]?.featuredImage ?? null),
  );
  return <EssentialsGrid cards={cards} />;
}

function EssentialsGrid({ cards }: { cards: EssentialCard[] }) {
  return (
    <ul className={GRID_CLASS}>
      {cards.map((card) => (
        <li key={card.title}>
          <Link className="group grid gap-7 text-center sm:gap-9" href={card.href}>
            <div className={ARCH_CLASS}>
              {card.image ? (
                <Image
                  alt={card.image.altText || card.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  src={card.image.url}
                />
              ) : null}
            </div>
            <div className="grid gap-4">
              <h3 className="text-sm font-semibold tracking-[0.3em] uppercase sm:text-base">
                {card.title}
              </h3>
              <p className="mx-auto max-w-[34ch] text-xs leading-relaxed tracking-[0.14em] text-cream/85 sm:text-[13px]">
                {card.description}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
