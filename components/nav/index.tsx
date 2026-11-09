import { PredictiveSearchProvider } from "@shopify/hydrogen/react";
import { Suspense } from "react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { shopConfig } from "@/lib/config";
import { getOtherMenuItems } from "@/lib/menu/server";
import type { MenuItem } from "@/lib/menu/types";

import { NavAccount, NavAccountFallback, ShopifyAccountLink } from "./account";
import { AnnouncementBar } from "./announcement-bar";
import { CartIcon, CartIconFallback } from "./cart";
import { MobileMenu } from "./mobile-menu";
import {
  HeaderShell,
  NavLink,
  type NavLinkItem,
  OtherMenu,
  StaticNavLink,
  StaticOtherMenu,
} from "./nav-client";
import { SearchModal } from "./search-modal";
import { WishlistIcon, WishlistIconFallback } from "./wishlist";

const LEFT_LINKS: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/collections/all", label: "Shop", match: ["/collections", "/products", "/search"] },
];

const RIGHT_LINKS: NavLinkItem[] = [{ href: "/about", label: "About" }];

function ActiveNavLink({ item }: { item: NavLinkItem }) {
  return (
    <Suspense fallback={<StaticNavLink item={item} />}>
      <NavLink item={item} />
    </Suspense>
  );
}

export async function Nav() {
  const otherItems = await getOtherMenuItems();
  const mobileItems: MenuItem[] = [
    ...[...LEFT_LINKS, ...RIGHT_LINKS].map(({ href, label }) => ({
      id: `nav-${href}`,
      items: [],
      title: label,
      url: href,
    })),
    { id: "nav-other", items: otherItems, title: "Other", url: "" },
    { id: "nav-join", items: [], title: "The Cire List", url: "/join" },
    { id: "nav-wishlist", items: [], title: "Wishlist", url: "/wishlist" },
  ];

  return (
    <>
      <AnnouncementBar />
      <HeaderShell>
        <Container className="grid h-19 grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-4">
            <MobileMenu items={mobileItems} />
            {/* The home page centers the logo between the links; every other page puts it on the left. */}
            <Link className="shrink-0 [body:has([data-route-segment=home])_&]:hidden" href="/">
              <Logo className="h-12 lg:h-16" loading="eager" />
            </Link>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden items-center gap-12 lg:flex">
              {LEFT_LINKS.map((item) => (
                <ActiveNavLink item={item} key={item.href} />
              ))}
            </div>
            <Link
              className="hidden shrink-0 [body:has([data-route-segment=home])_&]:block"
              href="/"
            >
              <Logo className="h-14.5" loading="eager" />
            </Link>
            <div className="hidden items-center gap-12 lg:flex">
              {RIGHT_LINKS.map((item) => (
                <ActiveNavLink item={item} key={item.href} />
              ))}
              <Suspense fallback={<StaticOtherMenu />}>
                <OtherMenu items={otherItems} />
              </Suspense>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 sm:gap-5">
            {shopConfig.search.isEnabled && (
              <PredictiveSearchProvider
                debounceInMs={300}
                limit={3}
                types={["PRODUCT", "COLLECTION", "QUERY"]}
              >
                <SearchModal />
              </PredictiveSearchProvider>
            )}
            <Suspense fallback={<WishlistIconFallback />}>
              <WishlistIcon />
            </Suspense>
            <Suspense fallback={<CartIconFallback />}>
              <CartIcon />
            </Suspense>
            {shopConfig.auth.isEnabled ? (
              <Suspense fallback={<NavAccountFallback />}>
                <NavAccount />
              </Suspense>
            ) : (
              <ShopifyAccountLink />
            )}
          </div>
        </Container>
      </HeaderShell>
    </>
  );
}
