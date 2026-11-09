import Link from "next/link";
import { Suspense } from "react";
import { CartCount, WishlistCount } from "@/components/header/counts";
import { HeaderShell } from "@/components/header/header-shell";
import { MobileMenu } from "@/components/header/mobile-menu";
import { NavLink, StaticNavLink } from "@/components/header/nav-links";
import { OtherMenu, StaticOtherMenu } from "@/components/header/other-menu";
import { CartIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { NAV_LEFT, NAV_RIGHT, type NavItem } from "@/lib/navigation";
import { getOtherLinks } from "@/lib/content";
import { accountUrl } from "@/lib/shopify";

function ActiveNavLink({ item }: { item: NavItem }) {
  return (
    <Suspense fallback={<StaticNavLink item={item} />}>
      <NavLink item={item} />
    </Suspense>
  );
}

const iconLink = "relative block p-1 transition-opacity hover:opacity-75";

export async function Header() {
  const otherLinks = await getOtherLinks();

  return (
    <HeaderShell>
      <div className="mx-auto grid h-(--header-h) max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-12">
        <div className="flex items-center">
          <MobileMenu otherLinks={otherLinks} accountUrl={accountUrl} />
        </div>

        <nav aria-label="Main" className="flex items-center gap-12">
          <div className="hidden items-center gap-12 lg:flex">
            {NAV_LEFT.map((item) => (
              <ActiveNavLink key={item.href} item={item} />
            ))}
          </div>
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>
          <div className="hidden items-center gap-12 lg:flex">
            {NAV_RIGHT.map((item) => (
              <ActiveNavLink key={item.href} item={item} />
            ))}
            <Suspense fallback={<StaticOtherMenu />}>
              <OtherMenu links={otherLinks} />
            </Suspense>
          </div>
        </nav>

        <div className="flex items-center justify-end gap-4 sm:gap-5">
          <Link href="/search" className={iconLink}>
            <SearchIcon className="size-5" />
            <span className="sr-only">Search</span>
          </Link>
          <Link href="/wishlist" className={`${iconLink} hidden sm:block`}>
            <HeartIcon className="size-5" />
            <span className="sr-only">Wishlist</span>
            <Suspense fallback={null}>
              <WishlistCount />
            </Suspense>
          </Link>
          <Link href="/cart" className={iconLink}>
            <CartIcon className="size-5" />
            <span className="sr-only">Cart</span>
            <Suspense fallback={null}>
              <CartCount />
            </Suspense>
          </Link>
          {accountUrl ? (
            <a href={accountUrl} className={`${iconLink} hidden sm:block`}>
              <UserIcon className="size-5" />
              <span className="sr-only">Account</span>
            </a>
          ) : null}
        </div>
      </div>
    </HeaderShell>
  );
}
