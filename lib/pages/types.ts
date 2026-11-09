import type { SEO } from "@/lib/seo/types";

export interface ContentPage {
  body: string;
  handle: string;
  seo: SEO;
  title: string;
}

export interface ContentPageLink {
  handle: string;
  title: string;
}
