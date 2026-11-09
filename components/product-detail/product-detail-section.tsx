import { cn } from "cn";
import { MinusIcon, PlusIcon } from "lucide-react";
import { type ReactNode, Suspense } from "react";

import { BundleComponents, BundleParents } from "@/components/product-detail/bundle-components";
import { BuyButtons, PurchaseOptions } from "@/components/product-detail/buy-buttons";
import { BuyWithShopLogo } from "@/components/product-detail/buy-with-shop-logo";
import { ComplementaryProducts } from "@/components/product-detail/complementary-products";
import { GALLERY_BUTTON_CLASS } from "@/components/product-detail/gallery-button";
import { GiftCardPurchaseForm } from "@/components/product-detail/gift-card-purchase-form";
import { ProductOpenGraph } from "@/components/product-detail/open-graph";
import {
  ProductForm,
  ProductFormOptions,
  ProductFormPrice,
} from "@/components/product-detail/product-form";
import { type GalleryItem, ProductGallery } from "@/components/product-detail/product-gallery";
import {
  ProductInfoDescription,
  ProductInfoOptions,
} from "@/components/product-detail/product-info";
import { ProductPrice } from "@/components/product-detail/product-price";
import { ProductRating } from "@/components/product-detail/product-rating";
import { ProductSchema } from "@/components/product-detail/schema";
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ProductWishlistToggle } from "@/components/wishlist/product-wishlist";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { findCategory, getCategoryHref } from "@/lib/categories";
import { shopConfig } from "@/lib/config";
import type { Image, Video } from "@/lib/media/types";
import {
  getProductPurchaseOptions,
  getSelectedColorImage,
  getSharedImages,
  hasColorImagePartitioning,
  toProductFormInput,
  toStaticOptionGroups,
} from "@/lib/product";
import { type SelectedOptions } from "@/lib/product/types";
import type { ProductDetails, ProductVariant } from "@/lib/product/types";

export function ProductDetailSection({
  product,
  selectedOptionsPromise,
  variantPromise,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
  variantPromise: Promise<ProductVariant | undefined>;
}) {
  const breadcrumbs = getBreadcrumbs(product);
  return (
    <>
      <ProductSchema
        product={{
          handle: product.handle,
          title: product.title,
          description: product.description,
          images: product.images,
          vendor: product.vendor,
          currencyCode: product.currencyCode,
          priceRange: product.priceRange,
          offerCount: product.variantsCount,
          availableForSale: product.availableForSale,
          sku: product.defaultVariantSku,
        }}
      />
      <ProductOpenGraph
        availableForSale={product.availableForSale}
        price={product.priceRange.minVariantPrice}
      />
      <BreadcrumbSchema
        items={breadcrumbs.map(({ href, label }) => ({ name: label, path: href }))}
      />
      <div className="grid gap-8 lg:gap-12">
        <Breadcrumbs current={product.title} links={breadcrumbs.slice(0, -1)} />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24">
          <ProductMediaArea product={product} selectedOptionsPromise={selectedOptionsPromise} />
          <ProductInfoArea product={product} variantPromise={variantPromise} />
        </div>
      </div>
    </>
  );
}

// The middle step is the product's shop category, or its first collection when its type has none.
function getBreadcrumbs(product: ProductDetails) {
  const category = findCategory(product.productType);
  return [
    { href: "/", label: "Home" },
    { href: "/collections/all", label: "Shop" },
    ...(category
      ? [{ href: getCategoryHref(category), label: category.title }]
      : product.collection
        ? [{ href: `/collections/${product.collection.handle}`, label: product.collection.title }]
        : []),
    { href: `/products/${product.handle}`, label: product.title },
  ];
}

function toGalleryItems(images: Image[], videos: Video[]): GalleryItem[] {
  return [
    ...images.map((image): GalleryItem => ({ image, type: "image" })),
    ...videos.map((video): GalleryItem => ({ type: "video", video })),
  ];
}

function ProductMediaArea({
  product,
  selectedOptionsPromise,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
}) {
  const wishlist = (
    <Suspense
      fallback={
        <WishlistButton className={GALLERY_BUTTON_CLASS} productId={product.id} saved={false} />
      }
    >
      <ProductWishlistToggle className={GALLERY_BUTTON_CLASS} productId={product.id} />
    </Suspense>
  );

  if (!hasColorImagePartitioning(product.options)) {
    return (
      <div className="lg:sticky lg:top-24">
        <ProductGallery
          items={toGalleryItems(product.images, product.videos)}
          title={product.title}
          wishlist={wishlist}
        />
      </div>
    );
  }

  const sharedImages = getSharedImages(product.images, product.options);
  return (
    <div className="lg:sticky lg:top-24">
      <Suspense
        fallback={
          <ProductGallery
            items={toGalleryItems(sharedImages, product.videos)}
            title={product.title}
            wishlist={wishlist}
          />
        }
      >
        <ColorProductGallery
          product={product}
          selectedOptionsPromise={selectedOptionsPromise}
          sharedImages={sharedImages}
          wishlist={wishlist}
        />
      </Suspense>
    </div>
  );
}

// The selected color's image leads the gallery, so it waits on the URL's option selection.
async function ColorProductGallery({
  product,
  selectedOptionsPromise,
  sharedImages,
  wishlist,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
  sharedImages: Image[];
  wishlist: ReactNode;
}) {
  const image = getSelectedColorImage(product, await selectedOptionsPromise);
  return (
    <ProductGallery
      items={toGalleryItems(image ? [image, ...sharedImages] : sharedImages, product.videos)}
      key={image?.url}
      title={product.title}
      wishlist={wishlist}
    />
  );
}

function ProductInfoArea({
  product,
  variantPromise,
}: {
  product: ProductDetails;
  variantPromise: Promise<ProductVariant | undefined>;
}) {
  const { handle, descriptionHtml } = product;
  const uniformStock = product.allVariantsInStock;
  const singleVariant = product.variantsCount === 1;
  const showBuyLabel = uniformStock && !singleVariant;
  const allInStock = product.defaultVariant?.availableForSale ?? product.availableForSale;
  const description = <ProductDescription descriptionHtml={descriptionHtml} />;
  return (
    <div className="grid gap-8">
      <h1 className="text-[clamp(1.75rem,2.7vw,2.375rem)] leading-tight font-semibold tracking-[0.01em] text-foreground uppercase">
        {product.title}
      </h1>

      {singleVariant ? (
        <ProductInfoContent
          description={description}
          priceSlot={
            !product.hasUniformPricing ? (
              <Suspense fallback={<div className="h-9" aria-hidden />}>
                <ResolvedProductPrice variantPromise={variantPromise} />
              </Suspense>
            ) : undefined
          }
          product={product}
          selectedVariant={product.defaultVariant}
        />
      ) : (
        <Suspense
          fallback={
            <ProductInfoFallback
              allInStock={allInStock}
              description={description}
              product={product}
              showLabel={showBuyLabel}
            />
          }
        >
          <ResolvedProductInfo
            description={description}
            product={product}
            variantPromise={variantPromise}
          />
        </Suspense>
      )}

      {!product.isGiftCard && shopConfig.pdp.bundles.isEnabled ? (
        <BundleRelationships variant={product.defaultVariant} />
      ) : null}

      {!product.isGiftCard && shopConfig.pdp.complementaryProducts.isEnabled ? (
        <ComplementaryProducts handle={handle} limit={4} title="Pairs Well With" />
      ) : null}
    </div>
  );
}

function ProductDescription({ descriptionHtml }: { descriptionHtml: string }) {
  if (!descriptionHtml) return null;
  return (
    <section aria-labelledby="product-description" className="grid gap-2">
      <h2 className="text-lg font-semibold" id="product-description">
        Description:
      </h2>
      <ProductInfoDescription className="text-justify" descriptionHtml={descriptionHtml} />
    </section>
  );
}

function PriceRow({ price, product }: { price: ReactNode; product: ProductDetails }) {
  return (
    <div className="grid gap-4">
      <div className="flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {price}
        {product.rating ? (
          <ProductRating count={product.rating.count} value={product.rating.value} />
        ) : null}
      </div>
      <hr className="dashed-rule text-foreground/40" />
    </div>
  );
}

function UniformPrice({ product }: { product: ProductDetails }) {
  return (
    <ProductPrice
      amount={product.priceRange.minVariantPrice.amount}
      compareAtAmount={product.compareAtPriceRange?.minVariantPrice.amount}
      currencyCode={product.priceRange.minVariantPrice.currencyCode}
    />
  );
}

function DeliveryTermsLink() {
  return (
    <Link
      className="w-fit text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      href="/policies/shipping-policy"
    >
      Delivery T&amp;C
    </Link>
  );
}

async function ResolvedProductPrice({
  variantPromise,
}: {
  variantPromise: Promise<ProductVariant | undefined>;
}) {
  const variant = await variantPromise;
  return (
    <ProductFormPrice
      fallbackVariant={
        variant ? { compareAtPrice: variant.compareAtPrice, price: variant.price } : undefined
      }
    />
  );
}

async function ResolvedProductInfo({
  description,
  product,
  variantPromise,
}: {
  description: ReactNode;
  product: ProductDetails;
  variantPromise: Promise<ProductVariant | undefined>;
}) {
  return (
    <ProductInfoContent
      description={description}
      product={product}
      selectedVariant={await variantPromise}
    />
  );
}

// The store is seeded from the URL-resolved variant so server HTML and client state agree on first paint.
function ProductInfoContent({
  description,
  priceSlot,
  product,
  selectedVariant,
}: {
  description: ReactNode;
  priceSlot?: ReactNode;
  product: ProductDetails;
  selectedVariant: ProductVariant | undefined;
}) {
  const formProduct = toProductFormInput(product, selectedVariant);
  const fallbackVariant = formProduct.selectedOrFirstAvailableVariant ?? undefined;

  return (
    <ProductForm product={formProduct}>
      <div className="grid gap-8">
        <PriceRow
          price={
            priceSlot ??
            (product.hasUniformPricing ? (
              <UniformPrice product={product} />
            ) : (
              <ProductFormPrice fallbackVariant={fallbackVariant} />
            ))
          }
          product={product}
        />
        {description}
        <ProductFormOptions handle={product.handle} />
        {product.isGiftCard ? (
          <GiftCardPurchaseForm />
        ) : (
          <BuyButtons
            fallbackVariant={fallbackVariant}
            availableForSale={product.availableForSale}
            buyWithShop={shopConfig.pdp.buyWithShop.isEnabled}
            quantityPicker={shopConfig.pdp.quantityPicker.isEnabled}
          />
        )}
        <DeliveryTermsLink />
      </div>
    </ProductForm>
  );
}

function ProductInfoFallback({
  allInStock,
  description,
  product,
  showLabel,
}: {
  allInStock: boolean;
  description: ReactNode;
  product: ProductDetails;
  showLabel: boolean;
}) {
  return (
    <div className="grid gap-8">
      <PriceRow
        price={
          product.hasUniformPricing ? <UniformPrice product={product} /> : <div className="h-9" />
        }
        product={product}
      />
      {description}
      <ProductInfoOptions options={toStaticOptionGroups(product)} hideImages />
      {product.isGiftCard ? (
        <GiftCardPurchaseFormFallback />
      ) : (
        <BuyButtonsFallback
          allInStock={allInStock}
          showLabel={showLabel}
          variant={product.defaultVariant}
        />
      )}
      <DeliveryTermsLink />
    </div>
  );
}

// Bundle relationships are product-level, so keep them in the static shell.
function BundleRelationships({ variant }: { variant: ProductVariant | undefined }) {
  if (!variant) return null;
  if (variant.components.length === 0 && variant.bundleParents.length === 0) return null;
  return (
    <div className="grid gap-5">
      <BundleComponents components={variant.components} title="Bundle Includes" />
      <BundleParents variants={variant.bundleParents} title="Available in Bundles" />
    </div>
  );
}

function GiftCardPurchaseFormFallback() {
  // Match the resolved form's geometry to avoid layout shift.
  return (
    <div className="grid gap-5">
      <div className="grid gap-2.5">
        <div className="grid gap-2.5">
          <Label>Recipient email</Label>
          <Input type="email" disabled placeholder="friend@example.com" />
        </div>
        <div className="grid gap-2.5">
          <Label>Recipient name</Label>
          <Input type="text" disabled placeholder="Friend's name (optional)" />
        </div>
        <div className="grid gap-2.5">
          <Label>Message</Label>
          <Textarea rows={3} disabled placeholder="Write a personal note (optional)" />
        </div>
        <div className="grid gap-3 rounded-lg border p-3">
          <div className="flex items-center justify-between gap-2.5">
            <Label>Schedule for later</Label>
            <span className="inline-flex h-[1.15rem] w-8 items-center rounded-full bg-input opacity-50" />
          </div>
        </div>
      </div>
      <div className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground opacity-50">
        Add to Cart
      </div>
    </div>
  );
}

function QuantityPickerFallback() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4">
      <span className="text-lg">Quantity:</span>
      <div className="grid h-11 w-28 shrink-0 grid-cols-3 items-center rounded-md border border-foreground/80">
        <MinusIcon className="mx-auto size-4 opacity-50" />
        <span className="text-center text-base tabular-nums">1</span>
        <PlusIcon className="mx-auto size-4" />
      </div>
    </div>
  );
}

function BuyButtonsFallback({
  allInStock,
  showLabel,
  variant,
}: {
  allInStock: boolean;
  showLabel: boolean;
  variant: ProductVariant | undefined;
}) {
  const { plans, selectedPlan } = getProductPurchaseOptions(variant);
  return (
    <div className="grid gap-6">
      {variant ? (
        <PurchaseOptions
          disabled
          plans={plans}
          price={variant.price}
          requiresSellingPlan={variant.requiresSellingPlan}
          selectedPlan={selectedPlan}
        />
      ) : null}
      {shopConfig.pdp.quantityPicker.isEnabled ? <QuantityPickerFallback /> : null}
      <div className="flex flex-wrap gap-3.5">
        <div className="flex h-12.5 min-w-36 flex-1 items-center justify-center rounded-md bg-primary text-base text-primary-foreground sm:text-lg">
          {showLabel ? (allInStock ? "Add To Cart" : "Out of Stock") : null}
        </div>
        {!selectedPlan && !variant?.requiresSellingPlan ? (
          <div
            className={cn(
              "flex h-12.5 min-w-36 flex-1 items-center justify-center rounded-md bg-white text-base text-olive-deep sm:text-lg",
              !allInStock && "opacity-50",
            )}
          >
            Checkout Now
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-8 lg:gap-12">
      <Skeleton className="h-5 w-64" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24">
        {/* The image slot stays static; a pulsing skeleton in the LCP slot flashes harder than an empty canvas. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 sm:gap-x-3.5">
          <div className="aspect-4/5 w-full bg-muted" />
          <div className="size-10 rounded-md bg-white/80 sm:size-13" />
        </div>
        <div className="grid gap-8">
          <div className="grid gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-2/3" />
          </div>
          <Skeleton className="h-9 w-28" />
          <div className="grid gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-6 w-24" />
            <div className="flex flex-wrap gap-2">
              {["w-13", "w-15", "w-13"].map((width, index) => (
                <Skeleton key={index} className={cn("h-11 rounded-md", width)} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Skeleton className="h-12.5 min-w-36 flex-1" />
            <Skeleton className="h-12.5 min-w-36 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
