import "server-only";

import { apiVersion, storeDomain } from "@/lib/shopify";

// The Storefront API can't subscribe an email on its own, so newsletter
// sign-ups use the Admin API. Requires a custom app token with the
// `read_customers` and `write_customers` scopes.
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();

export const isNewsletterConfigured = Boolean(storeDomain && adminToken);

type UserError = { field: string[] | null; message: string };

async function adminFetch<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(
    `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken!,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!res.ok) throw new Error(`Shopify Admin API responded ${res.status}`);
  const body = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data!;
}

const CONSENT = {
  marketingState: "SUBSCRIBED",
  marketingOptInLevel: "SINGLE_OPT_IN",
};

const CUSTOMER_CREATE = /* GraphQL */ `
  mutation SubscribeCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_BY_EMAIL = /* GraphQL */ `
  query SubscribeFind($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        emailMarketingConsent {
          marketingState
        }
      }
    }
  }
`;

const CONSENT_UPDATE = /* GraphQL */ `
  mutation SubscribeUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

/** Subscribes an email to marketing, creating the customer if needed. */
export async function subscribeToNewsletter(email: string): Promise<void> {
  const created = await adminFetch<{
    customerCreate: { customer: { id: string } | null; userErrors: UserError[] };
  }>(CUSTOMER_CREATE, {
    input: { email, emailMarketingConsent: CONSENT, tags: ["newsletter"] },
  });
  if (created.customerCreate.customer) return;

  const emailTaken = created.customerCreate.userErrors.some((e) =>
    e.field?.includes("email"),
  );
  if (!emailTaken) {
    throw new Error(
      created.customerCreate.userErrors.map((e) => e.message).join("; "),
    );
  }

  // Existing customer: make sure they're opted in.
  const found = await adminFetch<{
    customers: {
      nodes: {
        id: string;
        emailMarketingConsent: { marketingState: string } | null;
      }[];
    };
  }>(CUSTOMER_BY_EMAIL, { query: `email:"${email}"` });
  const customer = found.customers.nodes[0];
  if (!customer) throw new Error("Existing customer not found");
  if (customer.emailMarketingConsent?.marketingState === "SUBSCRIBED") return;

  const updated = await adminFetch<{
    customerEmailMarketingConsentUpdate: { userErrors: UserError[] };
  }>(CONSENT_UPDATE, {
    input: { customerId: customer.id, emailMarketingConsent: CONSENT },
  });
  const errors = updated.customerEmailMarketingConsentUpdate.userErrors;
  if (errors.length) throw new Error(errors.map((e) => e.message).join("; "));
}
