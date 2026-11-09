import { ChevronRight } from "lucide-react";

import { Link } from "@/components/ui/link";

interface BreadcrumbLink {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  current: string;
  links: BreadcrumbLink[];
}

export function Breadcrumbs({ current, links }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {links.map((link) => (
          <li className="flex items-center gap-3" key={link.href}>
            <Link className="transition-colors hover:text-foreground" href={link.href}>
              {link.label}
            </Link>
            <ChevronRight aria-hidden className="size-3.5" />
          </li>
        ))}
        <li aria-current="page" className="min-w-0 truncate text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
