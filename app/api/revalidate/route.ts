import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/shopify";

/**
 * Shopify webhook endpoint. Point product, collection and inventory webhooks
 * (Shopify admin → Settings → Notifications → Webhooks) at /api/revalidate so
 * catalog changes show up without waiting for the hourly cache refresh.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { error: "SHOPIFY_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = Buffer.from(
    request.headers.get("x-shopify-hmac-sha256") ?? "",
  );
  const expected = Buffer.from(
    createHmac("sha256", secret).update(body, "utf8").digest("base64"),
  );
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(signature, expected)
  ) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  const tags: string[] = [];
  if (topic.startsWith("products/") || topic.startsWith("inventory_levels/")) {
    tags.push(TAGS.products);
  }
  if (topic.startsWith("collections/")) {
    tags.push(TAGS.collections);
  }

  for (const tag of tags) revalidateTag(tag, "max");

  return Response.json({ revalidated: tags });
}
