import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/social-icons";
import { accountUrl, getShop } from "@/lib/shopify";
import { CONTACT_EMAIL, PAYMENT_METHODS, SOCIAL_LINKS } from "@/lib/site";

type FooterLink = { label: string; href: string };

// Pages, products and policies use Shopify's default handles, so each link
// starts working as soon as that content exists in Shopify admin.
const EXPLORE: FooterLink[] = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Best Sellers", href: "/shop/best-sellers" },
  { label: "Sale", href: "/shop/sale" },
];

const COLLECTION: FooterLink[] = [
  { label: "The Cire Set", href: "/products/the-cire-set" },
  { label: "Eyelash Trays", href: "/shop/eyelash-trays" },
  { label: "Adhesives", href: "/shop/adhesives" },
  { label: "Bonders", href: "/shop/bonders" },
  { label: "Primers", href: "/shop/primers" },
];

const CUSTOMER_CARE: FooterLink[] = [
  { label: "FAQs", href: "/pages/faqs" },
  { label: "Shipping & Returns", href: "/pages/shipping-returns" },
  ...(accountUrl
    ? [{ label: "Order Tracking", href: `${accountUrl}/orders` }]
    : []),
  { label: "Gift Cards", href: "/products/gift-card" },
  ...(accountUrl ? [{ label: "My Account", href: accountUrl }] : []),
];

const POLICIES: FooterLink[] = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Shipping Policy", href: "/policies/shipping-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
];

const SOCIALS = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: SOCIAL_LINKS.tiktok, Icon: TikTokIcon },
].filter((s) => s.href);

const heading =
  "mb-4 font-serif text-[13px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase sm:text-[15px] sm:tracking-[0.18em]";
const linkClass =
  "font-sans text-[13px] tracking-[0.06em] text-cream/90 transition-colors hover:text-cream hover:underline underline-offset-4";

function FooterAnchor({ link }: { link: FooterLink }) {
  return link.href.startsWith("http") ? (
    <a href={link.href} className={linkClass}>
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={linkClass}>
      {link.label}
    </Link>
  );
}

function FooterColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: FooterLink[];
  className?: string;
}) {
  const id = `footer-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <nav aria-labelledby={id} className={className}>
      <h2 id={id} className={heading}>
        {title}
      </h2>
      <ul className="space-y-2.5 text-[13px] leading-[1.45]">
        {links.map((link) => (
          <li key={link.label}>
            <FooterAnchor link={link} />
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

export async function Footer() {
  const shop = await getShop();

  return (
    <footer className="bg-olive text-cream">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-8 sm:px-10 lg:px-[6%]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-5">
          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Collection" links={COLLECTION} />

          <section
            aria-labelledby="footer-cire"
            className="col-span-2 text-center lg:col-span-1"
          >
            <h2 id="footer-cire" className={heading}>
              Cire
            </h2>
            <ul className="space-y-2.5 text-[13px] leading-[1.45]">
              <li>
                <Link href="/about" className={linkClass}>
                  Our Story
                </Link>
              </li>
              <li>
                {CONTACT_EMAIL ? (
                  <p className="font-sans tracking-[0.06em]">
                    Contact Us:
                    <br />
                    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                ) : (
                  <Link href="/pages/contact" className={linkClass}>
                    Contact Us
                  </Link>
                )}
              </li>
            </ul>
            {SOCIALS.length > 0 ? (
              <ul className="mt-5 flex justify-center gap-3.5">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-opacity hover:opacity-75"
                    >
                      <Icon className="size-6" />
                      <span className="sr-only">{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <FooterColumn
            title="Customer Care"
            links={CUSTOMER_CARE}
            className="lg:justify-self-end"
          />
          <FooterColumn
            title="Policies"
            links={POLICIES}
            className="lg:justify-self-end"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[3%]">
        <div className="mt-6 grid items-end gap-8 pb-3 lg:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden className="hidden lg:block" />
          <Link href="/" className="justify-self-center">
            <Logo tone="cream" className="h-[100px]" />
          </Link>
          <ul
            aria-label="Accepted payment methods"
            className="flex flex-wrap justify-center gap-3.5 lg:mb-4 lg:justify-end"
          >
            {PAYMENT_METHODS.map((method) => (
              <li key={method.name}>
                {/* Plain <img>: small static SVGs gain nothing from next/image. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={method.src}
                  alt={method.name}
                  width={38}
                  height={24}
                  className="block"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-cream/20 border-t">
        <p className="text-cream/45 pt-3.5 pb-7 text-center font-sans text-xs">
          © <CurrentYear /> {shop.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
