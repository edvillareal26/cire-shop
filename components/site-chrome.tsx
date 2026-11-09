import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { isDemoStore } from "@/lib/shopify";

/** Announcement bar, header and footer around a storefront page. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      {isDemoStore ? (
        <p className="bg-badge text-cream px-4 py-1.5 text-center text-xs">
          Demo catalog from mock.shop. Set <code>SHOPIFY_STORE_DOMAIN</code> to
          connect your store.
        </p>
      ) : null}
      <div className="bg-olive text-cream">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center px-5 font-sans text-[11px] tracking-[0.14em] sm:justify-between sm:px-12 sm:text-[13px]">
          <p>Free U.S Shipping on Orders $150+</p>
          <Link href="/join" className="hidden hover:underline sm:block">
            Join the CIRE List →
          </Link>
        </div>
      </div>
      <Header />
      {/* Pages start with a dark band that sits under the floating header. */}
      <main className="-mt-(--header-h) flex-1">{children}</main>
      <Footer />
    </>
  );
}
