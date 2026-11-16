import { CollectionLayout } from "@/components/collections/collection-page";
import { getProductTypeFilter } from "@/lib/categories";
import { ALL_PRODUCTS_HANDLE, SEARCH_SORT_EXCLUDE } from "@/lib/collections";
import { getAllProductsCollection } from "@/lib/collections/server";

export default async function AllProductsLayout({ children }: LayoutProps<"/shop">) {
  return (
    <CollectionLayout
      collection={await getAllProductsCollection()}
      handle={ALL_PRODUCTS_HANDLE}
      leadingFilters={[getProductTypeFilter()]}
      sortExclude={SEARCH_SORT_EXCLUDE}
    >
      {children}
    </CollectionLayout>
  );
}
