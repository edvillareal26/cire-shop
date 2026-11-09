import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichPage } from "@/components/rich-page";
import { getPolicies } from "@/lib/shopify";

// Store policies from Shopify admin (Settings → Policies).
export async function generateStaticParams() {
  const policies = await getPolicies();
  // Cache Components requires at least one entry.
  if (policies.length === 0) return [{ handle: "__none__" }];
  return policies.map((p) => ({ handle: p.handle }));
}

async function findPolicy(handle: string) {
  const policies = await getPolicies();
  return policies.find((p) => p.handle === handle) ?? null;
}

export async function generateMetadata({
  params,
}: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const policy = await findPolicy((await params).handle);
  return { title: policy?.title ?? "Policy not found" };
}

export default async function PolicyPage({
  params,
}: PageProps<"/policies/[handle]">) {
  const policy = await findPolicy((await params).handle);
  if (!policy) notFound();
  return <RichPage eyebrow="Policies" title={policy.title} html={policy.body} />;
}
