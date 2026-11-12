import Link from "next/link";
import { ListingLayout } from "@/components/listing/listing-layout";
import { sectionHref, type Section, type SectionFilter } from "@/lib/departments";
import type { Product } from "@/lib/products";

type Props = {
  section: Section;
  /** The active filter; undefined on the section's "View all" page. */
  filter?: SectionFilter;
  products: Product[];
};

export function SectionListing({ section, filter, products }: Props) {
  const tabs = [
    { label: "View all", href: sectionHref(section), active: !filter },
    ...section.filters.map((f) => ({
      label: f.label,
      href: sectionHref(section, f),
      active: f.slug === filter?.slug,
    })),
  ];

  return (
    <ListingLayout
      breadcrumbs={
        filter
          ? [{ label: section.label, href: sectionHref(section) }, { label: filter.label }]
          : [{ label: section.label }]
      }
      title={filter?.title ?? section.label}
      description={section.description}
      tabsLabel={`${section.label} categories`}
      tabs={tabs}
      products={products}
      empty={
        <>
          <p className="text-body text-ink-muted">
            Nothing here yet. New pieces arrive every season.
          </p>
          <Link href={sectionHref(section)} className="btn btn-secondary mt-6">
            View all {section.label.toLowerCase()}
          </Link>
        </>
      }
    />
  );
}
