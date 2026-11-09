// GraphQL documents for the Shopify Storefront API.
// Reference: https://shopify.dev/docs/api/storefront

const IMAGE = /* GraphQL */ `
  fragment Image on Image {
    url
    altText
    width
    height
  }
`;

const MONEY = /* GraphQL */ `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    productType
    availableForSale
    featuredImage {
      ...Image
    }
    priceRange {
      minVariantPrice {
        ...Money
      }
      maxVariantPrice {
        ...Money
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...Money
      }
      maxVariantPrice {
        ...Money
      }
    }
  }
  ${IMAGE}
  ${MONEY}
`;

const PRODUCT = /* GraphQL */ `
  fragment Product on Product {
    id
    handle
    title
    vendor
    productType
    description
    descriptionHtml
    availableForSale
    seo {
      title
      description
    }
    featuredImage {
      ...Image
    }
    images(first: 20) {
      nodes {
        ...Image
      }
    }
    options {
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice {
        ...Money
      }
    }
    variants(first: 250) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          ...Money
        }
        compareAtPrice {
          ...Money
        }
        image {
          ...Image
        }
      }
    }
  }
  ${IMAGE}
  ${MONEY}
`;

const CART = /* GraphQL */ `
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...Money
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            image {
              ...Image
            }
            product {
              handle
              title
              featuredImage {
                ...Image
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE}
  ${MONEY}
`;

export const SHOP_QUERY = /* GraphQL */ `
  query Shop {
    shop {
      name
      description
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT}
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          ...Image
        }
      }
    }
  }
  ${IMAGE}
`;

export const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      products(first: $first, sortKey: COLLECTION_DEFAULT) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const SEARCH_PRODUCTS_QUERY = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: PRODUCT) {
      nodes {
        ... on Product {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const PRODUCTS_BY_IDS_QUERY = /* GraphQL */ `
  query ProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const PAGES_QUERY = /* GraphQL */ `
  query Pages($first: Int!) {
    pages(first: $first) {
      nodes {
        handle
        title
      }
    }
  }
`;

export const PAGE_QUERY = /* GraphQL */ `
  query Page($handle: String!) {
    page(handle: $handle) {
      handle
      title
      body
      bodySummary
      seo {
        title
        description
      }
    }
  }
`;

const POLICY = /* GraphQL */ `
  fragment Policy on ShopPolicy {
    handle
    title
    body
  }
`;

export const POLICIES_QUERY = /* GraphQL */ `
  query Policies {
    shop {
      privacyPolicy {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
    }
  }
  ${POLICY}
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...Cart
    }
  }
  ${CART}
`;

const CART_USER_ERRORS = /* GraphQL */ `
  userErrors {
    field
    message
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...Cart
      }
      ${CART_USER_ERRORS}
    }
  }
  ${CART}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      ${CART_USER_ERRORS}
    }
  }
  ${CART}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      ${CART_USER_ERRORS}
    }
  }
  ${CART}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
      ${CART_USER_ERRORS}
    }
  }
  ${CART}
`;
