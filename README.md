# Cire Lash Collection

The Cire storefront, built on [Vercel Shop](https://github.com/vercel/shop) release 2026.11.1 (`.vercel-shop/template.json`). Template updates are applied with the `update-shop` skill.

## Setup

```sh
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm dev
```

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `NEXT_PUBLIC_SHOPIFY_SHOP_ID`: required.
- `SHOPIFY_ADMIN_CLIENT_ID` and `SHOPIFY_ADMIN_CLIENT_SECRET`: open The Cire List sign-ups at `/join` and in the home page's Cire Insider section. They come from a Dev Dashboard app with `read_customers` and `write_customers`, custom distribution, installed on the store in the same organization; the server trades them for 24-hour Admin API tokens. A store that already has a legacy custom app can set its `SHOPIFY_ADMIN_ACCESS_TOKEN` instead.

## Shopify content the storefront links to

| Link                               | Create in Shopify admin                                                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New Arrivals, Best Sellers, Sale   | Collections `new-arrivals` (sort newest), `best-sellers` (sort best selling), `sale`                                                                                                                             |
| The Cire Set                       | Products made with the Shopify Bundles app. The four newest feed the home section (lowest price first), which the footer link scrolls to, and they lead the shop page; a compare-at price shows the "Save" badge |
| Gift Cards                         | Product `gift-card`                                                                                                                                                                                              |
| FAQs, Shipping & Returns           | Pages `faqs`, `shipping-returns`; a page `about` replaces the default About copy                                                                                                                                 |
| Shipping, Refund, Terms of Service | Settings → Policies                                                                                                                                                                                              |

Contact email and social links are `CONTACT_EMAIL` and `SOCIAL_LINKS` in `components/footer/index.tsx`.

The product page breadcrumb shows the product's first collection (other than the home page one), so it appears once products are in collections. The star rating beside the price reads Shopify's standard `reviews.rating` and `reviews.rating_count` metafields, which review apps such as Judge.me fill in; it stays hidden until a product has reviews. Shopify doesn't give storefronts a units-sold count, so the design's "Sold" figure isn't shown.

## Before launch

- Coming soon: while `PRELAUNCH_PREVIEW_KEY` is set (Vercel → Settings → Environment Variables, Production only), every page shows The Cire List (`/join`) at its own URL, and sign-ups still work. Open `https://www.cirelashcollection.com/?preview=<key>` to see the full site in that browser for 60 days; `?preview=off` shows the coming-soon page again. To launch, delete the variable and redeploy. Preview deployments don't get the variable, so they show the full site. The gate is `lib/prelaunch/request.ts`; `/api/*`, `/.well-known/*` and `/images/*` stay open for Shopify webhooks, the cart API and images.
- `cirelashcollection.com` and `www` point at this site on Vercel. `checkout.cirelashcollection.com` points at Shopify and is the store's primary domain, so Shopify builds checkout links on it. The cart sends shoppers to whatever link Shopify returns, so nothing in the code names the checkout domain. Never make `www` or the bare domain primary in Shopify, or checkout links will open this site and 404.
- The Online Store password is off, so the Shopify theme is public at `checkout.cirelashcollection.com`, and links from checkout, customer accounts and Shopify emails back to the store open it. Redirect the theme to this site: in Shopify → Online Store → Themes → Edit code, put this first inside `<head>` in `layout/theme.liquid`. This site uses the same paths as the theme (`/products/…`, `/collections/…`, `/pages/…`), so shoppers land on the same page. The theme's front page goes to `/shop`: Shopify's "Shop" and "Shop now" links in customer accounts and checkout point at it, and Shopify has no setting to change them. Checkout, cart links and customer accounts don't use this layout, so they keep working, and the theme editor still opens.

  ```liquid
  {% unless request.design_mode %}
    <script>
      var path = location.pathname === "/" ? "/shop" : location.pathname;
      location.replace("https://www.cirelashcollection.com" + path + location.search);
    </script>
  {% endunless %}
  ```

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` stays a `.myshopify.com` domain. The old `ytbxyv-hu.myshopify.com` redirects to `cirelashcollection.myshopify.com` in a browser, but the APIs still answer on it.
- `public/images/cire-list-bg.jpg`, `cire-tools.jpg` and `cire-standard.jpg` are placeholders cropped from the design mockups; replace them with the original photos, keeping the same names.

## Cire customizations

- Brand: palette and fonts in `app/globals.css` and `app/layout.tsx`; `components/brand/` (logo, woven emblem). The store is olive with cream text; the home page switches back to cream with the `theme-cream` class.
- Navigation and footer: `components/nav/`, `components/footer/index.tsx`, `lib/menu/server.ts` (Other menu from Shopify pages and policies). The logo sits centered on the home page and on the left everywhere else.
- Cart: its own page at `/cart` (`components/cart/`); the template's slide-out drawer is removed. Add To Cart, quick add and the header cart icon all go to the page. Discount codes are entered at Shopify checkout, and shipping is calculated there.
- Product page: `components/product-detail/` (gallery, breadcrumb, rating, options, buy buttons). Checkout Now buys just the chosen item through a `/buy/` permalink and leaves the cart alone; Buy with Shop is off in `lib/config/index.ts`.
- Pages: `app/page.tsx` (home), `app/about/`, `app/join/` (The Cire List), `app/wishlist/`.
- Page spacing: `Page` (`components/ui/page.tsx`) pads every page `pt-16 pb-20 lg:pt-24 lg:pb-28` instead of the template's `pt-10`. The footer opens with a border, so the page itself needs bottom padding. The home page sets `py-0 lg:py-0` for its full-screen sections.
- Shop page: `/shop` (`app/shop/`) lists every product; it is the template's `/collections/all`, which now redirects to it with its filters (`next.config.ts`). Collections keep `/collections/<handle>`, the same paths as the Shopify theme.
- Home "Cire Insider" sign-up, the last section above the footer on the home page only: `components/home/cire-insider.tsx` with `components/join/subscribe-form.tsx`; both sign-up forms share `useJoinListForm` in `lib/newsletter/client.ts`.
- Home "The Cire Tools" banner and "The Cire Standard": `components/home/tools-and-standard.tsx` (Be the first to know links to `/join`).
- Categories (Lashes, Adhesives, Bonders, Primers): `lib/categories/index.ts`. Each is a Shopify **Product type** (Lash Extensions, Lash Adhesives, Lash Bonder, Lash Primer), so a product joins a category by its type and no collections are needed. The shop page (`/shop`) offers them as a **Product Type** filter in its Filters panel (several can be ticked at once; counts aren't shown because Shopify only counts the filters enabled in Search & Discovery); the home page's Shop the Essentials arches, the footer's category links and the product breadcrumb open the shop page with that category selected. The filter rides on Shopify search syntax (`product_type:"…"`), so it works without enabling a Product type filter in Search & Discovery. To add a category, add its product type to that list.
- Home "Shop the Essentials": `components/home/shop-the-essentials.tsx`. Each arch shows the best-selling product of its category.
- Images: Shopify images load straight from Shopify's CDN at the requested width (`lib/media/image-loader.ts`), which serves WebP or AVIF. Next's own optimizer gives up on a source after 7 seconds, which large product PNGs exceeded on slower connections. With the custom loader that optimizer is off, so local images in `public/` render with `unoptimized`.
- Domains: `lib/wishlist/`, `lib/newsletter/`, `lib/shopify/admin/server.ts`; `/join` hides the store chrome through `components/layout/`.

---

# Vercel Shop

Agent-ready commerce, powered by Shopify, Next, and Eve.

- **Shopify owns commerce.** Catalog, cart, checkout, customer accounts, predictive search, and policies come from Shopify through the framework-agnostic Hydrogen SDK (not the Hydrogen React Router framework).
- **Next.js owns the app.** Routing, Server Components, caching and invalidation, metadata, and the storefront's machine-readable surface for answer engines: Markdown representations, `/llms.txt`, structured data, and the sitemap.
- **Eve owns the agent.** Shop Agent's sessions, tools, and connections; its tools call Shopify directly.

See [vercel.shop](https://vercel.shop) for full documentation.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fshop&project-name=shop&repository-name=shop&demo-title=Vercel+Shop&demo-url=https%3A%2F%2Fshop-template.vercel.app&env=NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN%2CNEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN%2CNEXT_PUBLIC_SHOPIFY_SHOP_ID&envDescription=Required%20Shopify%20store%20domain%2C%20Storefront%20API%20token%2C%20and%20shop%20ID&envLink=https%3A%2F%2Fvercel.shop%2Fdocs%2Freference%2Fenv-vars)

Vercel prompts for the three required Shopify values before the first deployment.

## Getting Started

1. Create a new project with pnpm 12 and Node.js 26:

```sh
pnpm create next-app@latest my-store --example https://github.com/vercel/shop
```

The project includes the Shop skills for your agent in `.agents/skills/`.

2. In Shopify admin, create a storefront token in **Settings → Apps and sales channels → Headless**, enable the required Storefront API permissions, then add your Shopify credentials:

```sh
cp .env.example .env.local
```

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_SHOPIFY_SHOP_ID=123456789
```

3. Start the development server:

```sh
pnpm dev
```

For local HTTPS, install [Portless](https://portless.sh) globally with `pnpm add -g portless`, then run `pnpm dev:portless`.

See [vercel.shop/docs/getting-started](https://vercel.shop/docs/getting-started) for the full setup guide and [Storefront API Permissions](https://vercel.shop/docs/reference/storefront-api-permissions) for the complete scope reference.

## Features

Shopify

- Product, collection, search, blog, page, and policy content from the Storefront API with typed GraphQL
- Optimistic cart with Hydrogen forms, shared cart state, and server handlers
- Customer accounts through the Customer Account API, opt-in
- Shopify analytics, consent, and WebMCP tool registration, opt-in

Next.js

- Next.js 16 App Router, React 19, React Compiler, Tailwind CSS 4, shadcn/ui
- Partial prerendering with tagged caches invalidated by Shopify webhooks
- Markdown representations, `/llms.txt`, Schema.org data, sitemap, and robots for answer engines
- Single-locale storefront by default; skills add next-intl and Shopify Markets

Eve

- Shop Agent for product discovery, store questions, and cart updates in a side drawer, opt-in
- Shopify catalog and policy MCP connections plus Hydrogen cart handlers

Customer authentication is disabled by default. Follow the [authentication guide](https://vercel.shop/docs/anatomy/authentication) to configure Shopify credentials and callback URLs before enabling `auth.isEnabled` in `lib/config/index.ts`.

Shop Agent is disabled by default. Set `agent.isEnabled` to `true` in `lib/config/index.ts` and follow the [Shop Agent guide](https://vercel.shop/docs/anatomy/agent) to configure AI Gateway access, turn on bot protection, and review privacy and spending safeguards before enabling public chat.

## Skills

Shop skills guide agents through storefront setup and common commerce patterns. They ship in `.agents/skills/`, and Claude Code reads them through the `.claude/skills` symlink. To add them to an existing storefront, run this from its root:

```sh
pnpm dlx skills add vercel/shop --skill '*' --yes
```

Use the plain skill names below. Shopify AI Toolkit is separate external tooling for authoritative Shopify documentation, API schemas, and operation validation; the Shop skills do not include it. If it is unavailable, use official Shopify documentation and validation tooling.

| Skill                       | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `init-vercel-shop`          | Scaffold a storefront and configure Shopify credentials               |
| `build-shop`                | Build or adapt storefront routes with Vercel Shop patterns            |
| `shopify-graphql-reference` | Add Shopify-validated GraphQL operations in the template's layout     |
| `enable-analytics`          | Add Vercel Analytics, Speed Insights, and Google Tag Manager          |
| `enable-i18n`               | Locale-prefixed URL routing + next-intl message catalogs (no Markets) |
| `enable-shopify-markets`    | Multi-locale support with Shopify Markets and next-intl               |
| `enable-shopify-menus`      | Replace hardcoded nav/footer links with Shopify-managed menus         |
| `update-shop`               | Keep a storefront current with template changes                       |

## Documentation

Full documentation is available at [vercel.shop](https://vercel.shop).

## License

MIT
