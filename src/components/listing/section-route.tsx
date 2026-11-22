// Route exports for a shop section, so each section's page files stay a few
// lines long. `sectionRoute` backs /<section>; `sectionFilterRoute` backs
// /<section>/[category], prerendering one page per filter.

import type { Metadata } from "next";
import { SectionListing } from "@/components/listing/section-listing";
import { NotFoundView, notFoundMetadata } from "@/components/not-found-view";
import { getSectionProducts } from "@/db/queries";
import { getSectionFilter, sectionHref, type Section } from "@/lib/departments";

type FilterParams = { params: Promise<{ category: string }> };

export function sectionRoute(section: Section) {
  const metadata: Metadata = {
    title: section.label,
    description: section.description,
  };

  async function SectionPage() {
    const products = await getSectionProducts({
      categorySlugs: section.categorySlugs,
      department: section.department,
    });
    return <SectionListing section={section} products={products} />;
  }

  return { metadata, Page: SectionPage };
}

export function sectionFilterRoute(section: Section) {
  function generateStaticParams() {
    return section.filters.map((filter) => ({ category: filter.slug }));
  }

  async function generateMetadata({ params }: FilterParams): Promise<Metadata> {
    const filter = getSectionFilter(section, (await params).category);
    if (!filter) return notFoundMetadata;
    return { title: filter.title, description: section.description };
  }

  async function SectionFilterPage({ params }: FilterParams) {
    const filter = getSectionFilter(section, (await params).category);
    if (!filter) {
      return (
        <NotFoundView
          title="We can’t find that page"
          description={`This part of ${section.label.toLowerCase()} doesn’t exist, or the link may be out of date.`}
          action={{ label: `Shop all ${section.label.toLowerCase()}`, href: sectionHref(section) }}
        />
      );
    }

    const products = await getSectionProducts({
      categorySlugs:
        filter.categorySlugs ??
        (filter.categorySlug ? [filter.categorySlug] : section.categorySlugs),
      department: filter.department ?? section.department,
      newOnly: filter.newOnly,
    });
    return <SectionListing section={section} filter={filter} products={products} />;
  }

  return { generateStaticParams, generateMetadata, Page: SectionFilterPage };
}
