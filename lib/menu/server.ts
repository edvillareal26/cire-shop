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
    ...policies.map((policy) => ({
      id: `policy-${policy.handle}`,
      items: [],
      title: policy.title,
      url: `/policies/${policy.handle}`,
    })),
  ];
}
