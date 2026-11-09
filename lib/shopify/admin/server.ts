const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-10";
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

const SUBSCRIBED = { marketingOptInLevel: "SINGLE_OPT_IN", marketingState: "SUBSCRIBED" };

interface UserError {
  field: string[] | null;
  message: string;
}

export const isAdminApiConfigured = Boolean(ADMIN_ACCESS_TOKEN && STORE_DOMAIN);

async function adminRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    body: JSON.stringify({ query, variables }),
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN ?? "",
    },
    method: "POST",
  });
  if (!response.ok) throw new Error(`Shopify Admin API responded ${response.status}`);
  const body = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new Error(body.errors.map((error) => error.message).join("; "));
  if (!body.data) throw new Error("Shopify Admin API returned no data");
  return body.data;
}

const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation subscribeCustomerCreate($input: CustomerInput!) {
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

const CUSTOMER_BY_EMAIL_QUERY = /* GraphQL */ `
  query subscribeCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        emailMarketingConsent {
          marketingState
        }
        id
      }
    }
  }
`;

const CONSENT_UPDATE_MUTATION = /* GraphQL */ `
  mutation subscribeConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

// The Storefront API cannot subscribe an email on its own, so sign-ups use the Admin API.
export async function subscribeToEmailMarketing(email: string): Promise<void> {
  const created = await adminRequest<{
    customerCreate: { customer: { id: string } | null; userErrors: UserError[] };
  }>(CUSTOMER_CREATE_MUTATION, {
    input: { email, emailMarketingConsent: SUBSCRIBED, tags: ["newsletter"] },
  });
  if (created.customerCreate.customer) return;

  const { userErrors } = created.customerCreate;
  if (!userErrors.some((error) => error.field?.includes("email"))) {
    throw new Error(userErrors.map((error) => error.message).join("; "));
  }

  const found = await adminRequest<{
    customers: {
      nodes: { emailMarketingConsent: { marketingState: string } | null; id: string }[];
    };
  }>(CUSTOMER_BY_EMAIL_QUERY, { query: `email:"${email}"` });
  const customer = found.customers.nodes[0];
  if (!customer) throw new Error("Existing customer not found");
  if (customer.emailMarketingConsent?.marketingState === "SUBSCRIBED") return;

  const updated = await adminRequest<{
    customerEmailMarketingConsentUpdate: { userErrors: UserError[] };
  }>(CONSENT_UPDATE_MUTATION, {
    input: { customerId: customer.id, emailMarketingConsent: SUBSCRIBED },
  });
  const errors = updated.customerEmailMarketingConsentUpdate.userErrors;
  if (errors.length) throw new Error(errors.map((error) => error.message).join("; "));
}
