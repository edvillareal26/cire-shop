import { shopConfig } from "@/lib/config";

interface CollectionSchemaData {
  description: string;
  path: string;
  title: string;
  updatedAt?: string;
}

export function CollectionSchema({ collection }: { collection: CollectionSchemaData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description || undefined,
    url: `${shopConfig.site.url}${collection.path}`,
    dateModified: collection.updatedAt,
  };

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
}
