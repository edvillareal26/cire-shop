import Link from "next/link";
import { Container, PageHero } from "@/components/container";

export function NotFoundContent() {
  return (
    <>
      <PageHero eyebrow="404" title="Page not found" />
      <Container className="py-16 sm:py-24">
        <p className="text-muted max-w-md">
          The product or page you’re looking for may have moved or is no
          longer available.
        </p>
        <Link
          href="/shop"
          className="bg-olive text-cream hover:bg-olive-deep mt-8 inline-flex px-8 py-3.5 font-sans text-xs tracking-[0.24em] uppercase"
        >
          Shop the collection
        </Link>
      </Container>
    </>
  );
}
