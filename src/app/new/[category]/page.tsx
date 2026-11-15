import type { Metadata } from "next";
import {
  NEW_ARRIVALS_HREF,
  NewArrivalsListing,
  newArrivalsCopy,
} from "@/components/listing/new-arrivals-listing";
import { NotFoundView, notFoundMetadata } from "@/components/not-found-view";
import { getCategories, getNewArrivals } from "@/db/queries";

async function findCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

// Every category is prerendered, so a category with no new pieces shows the
// empty state rather than a 404.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/new/[category]">): Promise<Metadata> {
  const category = await findCategory((await params).category);
  if (!category) return notFoundMetadata;
  return {
    title: `New in ${category.name.toLowerCase()}`,
    description: newArrivalsCopy.description,
  };
}

export default async function NewArrivalsCategoryPage({
  params,
}: PageProps<"/new/[category]">) {
  const category = await findCategory((await params).category);
  if (!category) {
    return (
      <NotFoundView
        title="We can’t find that page"
        description="There’s no new arrivals category by that name, or the link may be out of date."
        action={{ label: "Shop all new arrivals", href: NEW_ARRIVALS_HREF }}
      />
    );
  }

  const products = await getNewArrivals();
  return <NewArrivalsListing allProducts={products} category={category} />;
}
