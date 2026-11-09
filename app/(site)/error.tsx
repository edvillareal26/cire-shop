"use client";

import { useEffect } from "react";
import { Container, PageHero } from "@/components/container";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <PageHero title="Something went wrong" />
      <Container className="py-16 sm:py-24">
        <p className="text-muted max-w-md">
          We couldn’t load this page. Please try again.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="bg-olive text-cream hover:bg-olive-deep mt-8 inline-flex px-8 py-3.5 font-sans text-xs tracking-[0.24em] uppercase"
        >
          Try again
        </button>
      </Container>
    </>
  );
}
