import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-5 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Dark band every page starts with. The site header floats over the top of
 * each page, so this band provides the backdrop and the space beneath it.
 */
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-olive-deep text-cream pt-[calc(var(--header-h)+3.5rem)] pb-14 sm:pb-16">
      <Container>
        {eyebrow ? (
          <p className="text-cream/70 mb-3 font-sans text-[11px] tracking-[0.28em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-5xl font-light italic sm:text-6xl">
          {title}
        </h1>
        {children}
      </Container>
    </section>
  );
}

/** Slim band for pages that don't need a title area (e.g. product pages). */
export function HeaderBand({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-olive-deep text-cream pt-[var(--header-h)]">
      {children ? <Container className="py-4">{children}</Container> : null}
    </div>
  );
}
