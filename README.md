# Cire Lash Collection storefront

A headless Shopify storefront for Cire Lash Collection, built with Next.js 16 (App Router, Cache Components) and the Shopify Storefront API.

Shoppers browse, save favorites, and build a cart on this site. **Checkout and payment happen on Shopify's hosted checkout**, which takes shipping, taxes, discounts and payment (Shop Pay, cards, Apple Pay, Google Pay, …) and creates the order in Shopify admin.

## Getting started

```bash
npm install
npm run dev
```

Store credentials go in `.env.local`, which is git-ignored. Next.js does **not** read `.env.example`; that file only documents the variables and is committed, so keep real values out of it.

| Variable | Required | Description |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | yes | `ytbxyv-hu.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | yes | Storefront API public access token (Headless sales channel) |
| `SHOPIFY_STOREFRONT_API_VERSION` | no | Defaults to `2026-10` |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | for sign-ups | Turns on the "Join the CIRE List" form (see below) |
| `SHOPIFY_WEBHOOK_SECRET` | no | Lets catalog changes appear instantly (see below) |

Without `SHOPIFY_STORE_DOMAIN`, the site falls back to the mock.shop demo catalog and shows a banner saying so.

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero, the collection, brand statement |
| `/shop` | All products with category filters (from each product's *type* in Shopify). `/products` redirects here |
| `/products/[handle]` | Gallery, curl/length/etc. options, add to cart, wishlist |
| `/about` | Brand story. Create a Shopify page with the handle `about` to replace the default copy |
| `/pages/[handle]` | Any page from Shopify admin → Online Store → Pages (e.g. Contact). Listed under **Other** |
| `/policies/[handle]` | Policies from Shopify admin → Settings → Policies. Listed under **Other** |
| `/search` | Product search |
| `/wishlist` | Saved products (stored in a cookie on the shopper's device) |
| `/cart` | Quantities, subtotal, **Check out** → Shopify checkout |
| `/join` | "The Cire List" sign-up page: full-screen, without the store header and footer |
| Account icon | Shopify's hosted customer accounts (sign in, orders) |

The **Other** menu and the footer's Information column fill themselves from Shopify pages and policies, so new pages added in Shopify admin appear automatically.

## Brand assets

- `public/images/hero.jpg`: home page hero photo. The text sits on the olive backdrop on the left; the image is anchored right.
- `public/images/cire-logo.png`: white wordmark used in the header, mobile menu and footer.
- `public/images/cire-list-bg.jpg`: background photo for `/join`. **The current file is a placeholder** made from the design mockup; replace it with the original photo, keeping the same name.
- `components/cire-emblem.tsx`: the woven diamond mark as an SVG, rebuilt from the brand artwork. Swap in the official vector if you have one.

Colors and fonts are defined in `app/globals.css` (olive `#4c583e` and cream `#fff7e6`, from Shopify's brand settings) and `app/layout.tsx` (Cormorant Garamond and Montserrat).

## Footer

- **Contact email and social links:** set them in `lib/site.ts`. Empty values are hidden; with no email, "Contact Us" links to the Contact page.
- **Payment marks** are listed in `lib/site.ts` (SVGs in `public/images/payment/`, MIT-licensed from Shopify's `payment_icons`).
- **Shop links** (New Arrivals, Best Sellers, Sale, Eyelash Trays, Adhesives, Bonders, Primers) are generated pages under `/shop/…`, defined in `lib/shop-views.ts`. Categories match each product's **Product type** in Shopify. Sale lists products whose compare-at price is above their price.
- **Content links** go to Shopify's default handles, so each one starts working once that content exists:

| Footer link | Create in Shopify admin |
| --- | --- |
| The Cire Set | Product with handle `the-cire-set` |
| Gift Cards | Gift card product with handle `gift-card` |
| FAQs | Online Store → Pages, handle `faqs` |
| Shipping & Returns | Online Store → Pages, handle `shipping-returns` |
| Shipping Policy, Refund Policy, Terms of Service | Settings → Policies |

## "Join the CIRE List" sign-ups

The Storefront API can't subscribe an email by itself, so sign-ups use the Admin API:

1. Shopify admin → Settings → Apps and sales channels → Develop apps → **Create an app**.
2. Grant the Admin API scopes `read_customers` and `write_customers`, and allow access to protected customer data (email).
3. Install the app and put its Admin API access token in `SHOPIFY_ADMIN_ACCESS_TOKEN`.

The form lives on `/join` (linked from "Join the CIRE List →" in the top bar). Subscribers appear in Shopify admin → Customers with email marketing subscribed and the tag `newsletter`. Until the token is set, the form replies "Sign-ups aren't open yet."

## Before going live: checkout domain

Shopify builds checkout links on the store's **primary domain** (currently `www.cirelashcollection.com`, which still points at Shopify). If you point `www` at this site, those links would land here and fail. Before switching DNS:

1. In Shopify admin → Settings → Domains, connect a subdomain such as `checkout.cirelashcollection.com` and make it the **primary** domain.
2. Point `www.cirelashcollection.com` at this site's host.

## Instant catalog updates (optional)

Set `SHOPIFY_WEBHOOK_SECRET` to the signing secret under Settings → Notifications → Webhooks. Then add JSON webhooks pointing to `https://<your-site>/api/revalidate` for `products/*`, `collections/*` and `inventory_levels/update`. Without webhooks, catalog changes appear within about an hour.

## How it works

- `lib/shopify/` holds the Storefront API client, queries and types. `lib/shopify/admin.ts` is the newsletter Admin API call.
- Storefront pages live in `app/(site)/`, whose layout adds the announcement bar, header and footer. `/join` sits outside that group so it renders on its own.
- Catalog and content are cached with `'use cache'` and prerendered. Cart, wishlist and search results are per-visitor and stream in behind `<Suspense>`.
- Cart and wishlist live in `httpOnly` cookies and change through Server Actions (`app/cart/actions.ts`, `app/wishlist/actions.ts`).
