import { CollectionLayout } from "@/components/collections/collection-page";
import { getProductTypeFilter } from "@/lib/categories";
import { SEARCH_SORT_EXCLUDE } from "@/lib/collections";
import { ALL_PRODUCTS_HANDLE, getAllProductsCollection } from "@/lib/collections/server";

export default async function AllProductsLayout({ children }: LayoutProps<"/collections/all">) {
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
