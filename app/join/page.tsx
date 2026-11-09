import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CireEmblem } from "@/components/cire-emblem";
import { Logo } from "@/components/logo";
import background from "@/public/images/cire-list-bg.jpg";
import { CireListForm } from "./cire-list-form";

export const metadata: Metadata = {
  title: "The Cire List",
  description:
    "Be the first to know when Cire opens its doors. Early access, first look and launch updates.",
};

// Standalone sign-up page: lives outside app/(site), so no store header/footer.
export default function JoinPage() {
  return (
    <main className="text-cream relative isolate flex min-h-svh flex-1 flex-col overflow-hidden bg-[#1d1910]">
      <Image
        src={background}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Keeps the centre legible over brighter parts of the photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_55%_at_50%_45%,rgba(20,17,11,0.4),transparent)]"
      />

      <header className="flex items-start justify-between px-5 pt-4 sm:pr-[4.7%] sm:pl-[4%]">
        <Link href="/" className="shrink-0">
          <Logo tone="cream" className="h-16 opacity-90 sm:h-[clamp(72px,11.2svh,105px)]" />
        </Link>
        <p className="mt-6 font-sans text-[11px] tracking-[0.3em] uppercase sm:mt-10 sm:text-sm sm:tracking-[0.32em]">
          The Cire List
        </p>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-5 pt-4 pb-16 text-center sm:pb-[clamp(1rem,calc((100svh_-_680px)_*_0.5),8rem)]">
        <CireEmblem className="w-24 text-[#9d957f] sm:w-[clamp(96px,14.5svh,136px)]" />
        <h1 className="mt-10 font-serif text-[clamp(2.4rem,4.25vw,3.8rem)] leading-none font-normal tracking-[0.18em] uppercase sm:mt-[clamp(1.25rem,3.4svh,2rem)]">
          Look closer.
        </h1>
        <p className="mt-4 font-serif text-[clamp(1.3rem,2.16vw,1.95rem)] leading-none tracking-[0.175em] uppercase sm:mt-3">
          Something is coming.
        </p>
        <p className="text-cream/90 mt-10 font-serif text-lg leading-[1.45] tracking-[0.22em] sm:mt-[clamp(1.5rem,5.1svh,3rem)] sm:text-xl sm:leading-[1.2]">
          Be the first to know when
          <br />
          Cire opens its doors.
        </p>
        <CireListForm />
        <p className="text-cream/85 mt-6 font-sans text-[10px] tracking-[0.16em] uppercase sm:text-[11px] sm:tracking-[0.3em]">
          Early access. First look. Launch updates.
        </p>
      </section>

      <footer className="px-5 pb-6 sm:pr-[4.7%] sm:pb-9 sm:pl-[3.8%]">
        <div className="h-[3px] rounded-full bg-[#a59f91]" />
        <div className="mt-3 flex justify-between gap-4 font-sans text-[10px] tracking-[0.3em] uppercase sm:text-xs">
          <p>Notice the detail</p>
          <p>Perfect the ritual</p>
        </div>
      </footer>
    </main>
  );
}
