import { CONTACT_POLICY_HANDLE } from "@/lib/contact";
import type { MenuItem } from "@/lib/menu/types";
import { getPages } from "@/lib/pages/server";
import { getShopPolicies } from "@/lib/policies/server";

export async function getOtherMenuItems(): Promise<MenuItem[]> {
  const [pages, policies] = await Promise.all([getPages(), getShopPolicies()]);
  return [
    ...pages
      .filter((page) => page.handle !== "about")
      .map((page) => ({
        id: `page-${page.handle}`,
        items: [],
        title: page.title,
        url: `/pages/${page.handle}`,
      })),
    { id: "contact", items: [], title: "Contact Information", url: "/contact" },
    ...policies
      .filter((policy) => policy.handle !== CONTACT_POLICY_HANDLE)
      .map((policy) => ({
        id: `policy-${policy.handle}`,
        items: [],
        title: policy.title,
        url: `/policies/${policy.handle}`,
      })),
  ];
}
