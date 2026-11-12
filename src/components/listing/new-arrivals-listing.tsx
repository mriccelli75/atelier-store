import Link from "next/link";
import { ListingLayout } from "@/components/listing/listing-layout";
import { hero } from "@/lib/catalog";
import type { Category, Product } from "@/lib/products";

export const NEW_ARRIVALS_HREF = "/new";

export const newArrivalsCopy = {
  label: "New in",
  title: "New arrivals",
  description:
    "The latest pieces from the workshop, newest first. Small runs, so once they’re gone they’re gone.",
};

export const newCategoryHref = (slug: string) => `${NEW_ARRIVALS_HREF}/${slug}`;

/** Categories that currently have new arrivals, in the order products list them. */
export function newArrivalCategories(products: Product[]) {
  const seen = new Map<string, Pick<Category, "slug" | "name">>();
  for (const product of products) seen.set(product.category.slug, product.category);
  return [...seen.values()];
}

type Props = {
  /** Every new arrival; used to build the category tabs. */
  allProducts: Product[];
  /** Active category; undefined on "View all". */
  category?: Pick<Category, "slug" | "name">;
};

export function NewArrivalsListing({ allProducts, category }: Props) {
  const products = category
    ? allProducts.filter((product) => product.category.slug === category.slug)
    : allProducts;

  const tabs = [
    { label: "View all", href: NEW_ARRIVALS_HREF, active: !category },
    ...newArrivalCategories(allProducts).map((c) => ({
      label: c.name,
      href: newCategoryHref(c.slug),
      active: c.slug === category?.slug,
    })),
  ];

  return (
    <ListingLayout
      breadcrumbs={
        category
          ? [
              { label: newArrivalsCopy.label, href: NEW_ARRIVALS_HREF },
              { label: category.name },
            ]
          : [{ label: newArrivalsCopy.label }]
      }
      eyebrow={hero.season}
      title={category ? `New in ${category.name.toLowerCase()}` : newArrivalsCopy.title}
      description={newArrivalsCopy.description}
      tabsLabel="New arrivals categories"
      tabs={tabs}
      products={products}
      empty={
        <>
          <p className="text-body text-ink-muted">
            Nothing new here right now. New pieces arrive every season.
          </p>
          <Link
            href={category ? NEW_ARRIVALS_HREF : "/"}
            className="btn btn-secondary mt-6"
          >
            {category ? "View all new arrivals" : "Go to the homepage"}
          </Link>
        </>
      }
    />
  );
}
