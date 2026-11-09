import type { Metadata } from "next";
import Image from "next/image";

import { Emblem } from "@/components/brand/emblem";
import { Logo } from "@/components/brand/logo";
import { JoinForm } from "@/components/join/join-form";
import { Link } from "@/components/ui/link";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import background from "@/public/images/cire-list-bg.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const title = "The Cire List";
  const description =
    "Be the first to know when Cire opens its doors. Early access, first look and launch updates.";
  return {
    alternates: buildAlternates({ pathname: "/join" }),
    description,
    openGraph: buildOpenGraph({ description, title, type: "website", url: "/join" }),
    title,
  };
}

// Sizes scale with window height so the composition fits laptop screens without scrolling.
export default function JoinPage() {
  return (
    <div className="relative isolate flex min-h-svh flex-1 flex-col overflow-hidden bg-[#1d1910] text-cream">
      <Image
        alt=""
        className="-z-10 object-cover"
        fill
        placeholder="blur"
        preload
        src={background}
        unoptimized
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_55%_at_50%_45%,rgba(20,17,11,0.4),transparent)]"
      />

      <header className="flex items-start justify-between px-5 pt-4 sm:pr-[4.7%] sm:pl-[4%]">
        <Link className="shrink-0" href="/">
          <Logo className="h-16 opacity-90 sm:h-[clamp(72px,11.2svh,105px)]" tone="cream" />
        </Link>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] sm:mt-10 sm:text-sm sm:tracking-[0.32em]">
          The Cire List
        </p>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-5 pt-4 pb-16 text-center sm:pb-[clamp(1rem,calc((100svh_-_680px)_*_0.5),8rem)]">
        <Emblem className="w-24 text-[#9d957f] sm:w-[clamp(96px,14.5svh,136px)]" />
        <h1 className="mt-10 font-serif text-[clamp(2.4rem,4.25vw,3.8rem)] leading-none font-normal uppercase tracking-[0.18em] sm:mt-[clamp(1.25rem,3.4svh,2rem)]">
          Look closer.
        </h1>
        <p className="mt-4 font-serif text-[clamp(1.3rem,2.16vw,1.95rem)] leading-none uppercase tracking-[0.175em] sm:mt-3">
          Something is coming.
        </p>
        <p className="mt-10 font-serif text-lg leading-[1.45] tracking-[0.22em] text-cream/90 sm:mt-[clamp(1.5rem,5.1svh,3rem)] sm:text-xl sm:leading-[1.2]">
          Be the first to know when
          <br />
          Cire opens its doors.
        </p>
        <div className="mt-10 grid w-full justify-items-center sm:mt-[clamp(1.5rem,4.7svh,2.75rem)]">
          <JoinForm />
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-cream/85 sm:text-[11px] sm:tracking-[0.3em]">
          Early access. First look. Launch updates.
        </p>
      </section>

      <footer className="px-5 pb-6 sm:pr-[4.7%] sm:pb-9 sm:pl-[3.8%]">
        <div className="h-0.75 rounded-full bg-[#a59f91]" />
        <div className="mt-3 flex justify-between gap-4 text-[10px] uppercase tracking-[0.3em] sm:text-xs">
          <p>Notice the detail</p>
          <p>Perfect the ritual</p>
        </div>
      </footer>
    </div>
  );
}
