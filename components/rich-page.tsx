import { Container, PageHero } from "@/components/container";

/** A Shopify page or policy: title band plus the merchant's HTML. */
export function RichPage({
  eyebrow,
  title,
  html,
}: {
  eyebrow?: string;
  title: string;
  html: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <Container className="py-16 sm:py-20">
        {html.trim() ? (
          <div
            className="rich-text mx-auto max-w-3xl text-[15px]"
            // Authored by the merchant in Shopify admin.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-muted mx-auto max-w-3xl">
            This page is being updated. Please check back soon.
          </p>
        )}
      </Container>
    </>
  );
}
