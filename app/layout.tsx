import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { getShop } from "@/lib/shopify";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const shop = await getShop();
  return {
    title: { default: shop.name, template: `%s | ${shop.name}` },
    description:
      shop.description ?? "Premium lash essentials for a higher standard.",
  };
}

// Storefront pages get their header and footer from app/(site)/layout.tsx;
// standalone pages such as /join render without them.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
