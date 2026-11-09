// Types mirroring the shapes selected in ./queries.ts.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type SEO = {
  title: string | null;
  description: string | null;
};

export type Shop = {
  name: string;
  description: string | null;
};

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  name: string;
  optionValues: { name: string }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  seo: SEO;
  featuredImage: Image | null;
  images: { nodes: Image[] };
  options: ProductOption[];
  priceRange: { minVariantPrice: Money };
  variants: { nodes: ProductVariant[] };
};

export type CollectionSummary = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  products: { nodes: ProductCard[] };
};

export type PageSummary = {
  handle: string;
  title: string;
};

export type Page = {
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: SEO;
};

export type Policy = {
  handle: string;
  title: string;
  body: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    image: Image | null;
    product: {
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: { nodes: CartLine[] };
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type CartLineUpdateInput = {
  id: string;
  quantity: number;
};

export type UserError = {
  field: string[] | null;
  message: string;
};

export type ProductSortKey =
  | "BEST_SELLING"
  | "CREATED_AT"
  | "PRICE"
  | "TITLE"
  | "UPDATED_AT"
  | "RELEVANCE";
