import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NewArrivalsListing,
  newArrivalsCopy,
} from "@/components/listing/new-arrivals-listing";
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
  if (!category) return {};
  return {
    title: `New in ${category.name.toLowerCase()}`,
    description: newArrivalsCopy.description,
  };
}

export default async function NewArrivalsCategoryPage({
  params,
}: PageProps<"/new/[category]">) {
  const category = await findCategory((await params).category);
  if (!category) notFound();

  const products = await getNewArrivals();
  return <NewArrivalsListing allProducts={products} category={category} />;
}
