import { cn } from "cn";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { Link } from "@/components/ui/link";
import standardImage from "@/public/images/cire-standard.jpg";
import toolsImage from "@/public/images/cire-tools.jpg";

// Warm stone and espresso tones from the design, separate from the cream theme around them.
const INK = "text-[#3b2821]";
const EYEBROW_CLASS = "text-[13px] tracking-[0.26em] uppercase sm:text-sm lg:text-base";
const HEADING_CLASS = "font-serif font-normal tracking-[-0.01em]";

export function ToolsComingSoon() {
  return (
    <section
      aria-labelledby="tools-heading"
      className={cn(
        "relative isolate grid overflow-hidden bg-[#c3b9a8] lg:block lg:aspect-[43/10]",
        INK,
      )}
    >
      <div className="grid content-center gap-5 px-6 py-14 sm:px-12 lg:h-full lg:w-[42%] lg:py-0 lg:pl-[6.9%]">
        <p className={EYEBROW_CLASS}>The Cire Tools</p>
        <div className="grid gap-3">
          <h2
            className={cn(HEADING_CLASS, "text-[clamp(2.5rem,4.6vw,4.5rem)]/[1.05]")}
            id="tools-heading"
          >
            Coming Soon.
          </h2>
          <p className="text-base tracking-[0.12em] sm:text-lg lg:text-xl">
            Considered tools. Precise application.
          </p>
        </div>
        <ArrowLink className="mt-6" href="/join">
          Be the first to know
        </ArrowLink>
      </div>
      {/* The photo fades into the stone background on wide screens, where the text overlaps it. */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[62%] lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]">
        <Image
          alt="Cire lash tweezers resting on stone"
          className="object-cover object-right"
          fill
          src={toolsImage}
          unoptimized
        />
      </div>
    </section>
  );
}

export function CireStandard() {
  return (
    <section
      aria-labelledby="standard-heading"
      className={cn("grid bg-[#f9f9f9] lg:grid-cols-[45.5fr_54.5fr]", INK)}
    >
      <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[30vw]">
        <Image
          alt="A Cire lash tray"
          className="object-cover"
          fill
          src={standardImage}
          unoptimized
        />
        <p className="absolute right-6 bottom-6 text-right text-[11px] leading-snug text-white uppercase sm:right-10">
          <span className="block font-semibold">A higher</span>
          <span className="block text-white/85">standard always</span>
        </p>
      </div>
      <div className="grid content-center gap-6 px-6 py-14 sm:px-12 lg:py-20 lg:pr-[8%] lg:pl-[8.2%]">
        <p className={EYEBROW_CLASS}>The Cire Standard</p>
        <h2
          className={cn(HEADING_CLASS, "text-[clamp(2.5rem,4.2vw,4.25rem)]/[1.05]")}
          id="standard-heading"
        >
          The art of beauty, refined.
        </h2>
        <p className="max-w-[40rem] text-base leading-snug tracking-[0.1em] sm:text-lg lg:text-xl">
          From lash trays to aftercare, every Cire essential is designed with intention – for a more
          seamless, beautiful lash experience.
        </p>
        <ArrowLink className="mt-8" href="/about">
          Our story
        </ArrowLink>
      </div>
    </section>
  );
}

interface ArrowLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

function ArrowLink({ children, className, href }: ArrowLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex w-fit items-center gap-3 text-sm font-medium tracking-[0.22em] uppercase sm:text-[15px] lg:text-[17px]",
        className,
      )}
      href={href}
    >
      <span className="underline decoration-1 underline-offset-[6px]">{children}</span>
      <MoveRight
        aria-hidden
        className="size-5 transition-transform group-hover:translate-x-1"
        strokeWidth={1.25}
      />
    </Link>
  );
}
