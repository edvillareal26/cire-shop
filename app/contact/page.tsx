import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

const INTRO =
  "Whether you have a question about our products, an existing order, or becoming part of the Cire community, we’re here to help.";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contact Information";
  return {
    alternates: buildAlternates({ pathname: "/contact" }),
    description: INTRO,
    openGraph: buildOpenGraph({ description: INTRO, title, type: "website", url: "/contact" }),
    title,
  };
}

export default function ContactPage() {
  return (
    <Page>
      <Container className="grid max-w-216 gap-14 text-lg">
        <div className="grid gap-10 text-center">
          <h1 className="font-serif text-4xl font-light sm:text-[2.5rem]">Contact Information</h1>
          <p className="mx-auto max-w-200">{INTRO}</p>
        </div>

        <div className="grid gap-8 border-b border-cream/40 pb-10 md:grid-cols-2 md:items-center md:gap-0">
          <ul className="grid justify-center gap-6 md:pr-10">
            <li className="flex items-center gap-4">
              <MapPin aria-hidden className="size-5 shrink-0" strokeWidth={1.25} />
              Houston, Texas
            </li>
            <li className="flex items-center gap-4">
              <Mail aria-hidden className="size-5 shrink-0" strokeWidth={1.25} />
              <a className="underline-offset-4 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <div className="grid gap-6 border-t border-cream/40 pt-8 md:border-t-0 md:border-l md:py-2 md:pl-9">
            <p>
              <strong className="font-semibold">Business Hours</strong>: Monday – Saturday
            </p>
            <p>
              For order inquiries, please include your order number so we can assist you faster.
            </p>
            <p>We aim to respond to all inquiries within 1–2 business days.</p>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-162 gap-18">
          <div className="grid gap-4">
            <p>Got questions? Send us an email. We’d love to hear from you.</p>
            <ContactForm />
          </div>
          <div className="grid gap-6">
            <p>Thank you for choosing Cire Lash Collection.</p>
            <p className="italic">Perfect the ritual. Notice the detail.</p>
          </div>
        </div>
      </Container>
    </Page>
  );
}
