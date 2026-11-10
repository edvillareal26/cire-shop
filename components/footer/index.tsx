import { cn } from "cn";
import { cacheLife } from "next/cache";
import Image from "next/image";

import { Logo } from "@/components/brand/logo";
import { MenuLink } from "@/components/nav/menu-link";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { CATEGORIES, getCategoryHref } from "@/lib/categories";
import { shopConfig } from "@/lib/config";

import { SocialLinks } from "./social-links";
import type { SocialLink } from "./social-links";

interface FooterLink {
  title: string;
  url: string;
}

const CONTACT_EMAIL = "";
const SOCIAL_LINKS: SocialLink[] = [
  { platform: "facebook", url: "https://www.facebook.com/cirelashcollection" },
  { platform: "instagram", url: "https://www.instagram.com/cirelashcollection" },
  { platform: "tiktok", url: "https://www.tiktok.com/@cirelashcollection" },
];
const SHOPIFY_ACCOUNT_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account`;
const ACCOUNT_URL = shopConfig.auth.isEnabled ? "/account" : SHOPIFY_ACCOUNT_URL;

const EXPLORE: FooterLink[] = [
  { title: "Shop All", url: "/collections/all" },
  { title: "New Arrivals", url: "/collections/new-arrivals" },
  { title: "Best Sellers", url: "/collections/best-sellers" },
  { title: "Sale", url: "/collections/sale" },
];

// The footer names the lashes category "Eyelash Trays"; every category opens the filtered shop page.
const CATEGORY_LINK_TITLES: Record<string, string> = { "Lash Extensions": "Eyelash Trays" };

const COLLECTION: FooterLink[] = [
  { title: "The Cire Set", url: "/collections/the-cire-retention-collection" },
  ...CATEGORIES.map((category) => ({
    title: CATEGORY_LINK_TITLES[category.productType] ?? category.title,
    url: getCategoryHref(category),
  })),
];

const CUSTOMER_CARE: FooterLink[] = [
  { title: "FAQs", url: "/pages/faqs" },
  { title: "Shipping & Returns", url: "/pages/shipping-returns" },
  {
    title: "Order Tracking",
    url: shopConfig.auth.isEnabled ? "/account/orders" : `${SHOPIFY_ACCOUNT_URL}/orders`,
  },
  { title: "Gift Cards", url: "/products/gift-card" },
  { title: "My Account", url: ACCOUNT_URL },
];

const POLICIES: FooterLink[] = [
  { title: "Privacy Policy", url: "/policies/privacy-policy" },
  { title: "Shipping Policy", url: "/policies/shipping-policy" },
  { title: "Refund Policy", url: "/policies/refund-policy" },
  { title: "Terms of Service", url: "/policies/terms-of-service" },
];

const PAYMENT_METHODS = [
  { name: "American Express", src: "/images/payment/amex.svg" },
  { name: "Google Pay", src: "/images/payment/google-pay.svg" },
  { name: "Apple Pay", src: "/images/payment/apple-pay.svg" },
  { name: "PayPal", src: "/images/payment/paypal.svg" },
  { name: "Mastercard", src: "/images/payment/mastercard.svg" },
  { name: "Visa", src: "/images/payment/visa.svg" },
];

const HEADING_CLASS =
  "mb-4 font-serif text-[13px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap sm:text-[15px] sm:tracking-[0.18em]";
const LINK_CLASS =
  "text-[13px] tracking-[0.06em] text-cream/90 underline-offset-4 transition-colors hover:text-cream hover:underline";

export function Footer() {
  return (
    <footer className="border-t border-cream/20 bg-olive text-cream [--foreground:var(--cream)] [--muted-foreground:var(--cream)]">
      <Container className="pt-8 sm:px-10 lg:px-[6%]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-5">
          <FooterColumn links={EXPLORE} title="Explore" />
          <FooterColumn links={COLLECTION} title="Collection" />
          <section
            aria-labelledby="footer-cire"
            className="col-span-2 grid justify-items-center gap-5 text-center lg:col-span-1 lg:content-start"
          >
            <div>
              <h2 className={HEADING_CLASS} id="footer-cire">
                Cire
              </h2>
              <ul className="grid gap-2.5 text-[13px] leading-[1.45]">
                <li>
                  <Link className={LINK_CLASS} href="/about">
                    Our Story
                  </Link>
                </li>
                <li>
                  {CONTACT_EMAIL ? (
                    <p className="tracking-[0.06em]">
                      Contact Us:
                      <br />
                      <a className={LINK_CLASS} href={`mailto:${CONTACT_EMAIL}`}>
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  ) : (
                    <Link className={LINK_CLASS} href="/pages/contact">
                      Contact Us
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            {SOCIAL_LINKS.length > 0 && (
              // Sizes the template's icons to the Cire footer design without editing them.
              <div className="[&_a]:transition-opacity [&_a:hover]:opacity-75 [&_svg]:size-6 [&>div]:gap-3.5">
                <SocialLinks links={SOCIAL_LINKS} />
              </div>
            )}
          </section>
          <FooterColumn
            className="lg:justify-self-end"
            links={CUSTOMER_CARE}
            title="Customer Care"
          />
          <FooterColumn className="lg:justify-self-end" links={POLICIES} title="Policies" />
        </div>
      </Container>

      <Container className="sm:px-10 lg:px-[3%]">
        <div className="mt-6 grid items-end gap-8 pb-3 lg:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden className="hidden lg:block" />
          <Link className="justify-self-center" href="/">
            <Logo className="h-25" tone="cream" />
          </Link>
          <ul
            aria-label="Accepted payment methods"
            className="flex flex-wrap justify-center gap-3.5 lg:mb-4 lg:justify-end"
          >
            {PAYMENT_METHODS.map((method) => (
              <li key={method.name}>
                <Image
                  alt={method.name}
                  height={24}
                  sizes="100vw"
                  src={method.src}
                  unoptimized
                  width={38}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream/20">
        <p
          className={cn(
            "pt-3.5 pb-7 text-center text-xs text-cream/45",
            shopConfig.agent.isEnabled && "pb-22",
          )}
        >
          © <CurrentYear /> {shopConfig.site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  className?: string;
  links: FooterLink[];
  title: string;
}

function FooterColumn({ className, links, title }: FooterColumnProps) {
  const id = `footer-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <nav aria-labelledby={id} className={className}>
      <h2 className={HEADING_CLASS} id={id}>
        {title}
      </h2>
      <ul className="grid gap-2.5 text-[13px] leading-[1.45]">
        {links.map((link) => (
          <li key={link.title}>
            <MenuLink className={LINK_CLASS} url={link.url}>
              {link.title}
            </MenuLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
