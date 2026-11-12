import type { Metadata } from "next";
import {
  NewArrivalsListing,
  newArrivalsCopy,
} from "@/components/listing/new-arrivals-listing";
import { getNewArrivals } from "@/db/queries";

export const metadata: Metadata = {
  title: newArrivalsCopy.title,
  description: newArrivalsCopy.description,
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();
  return <NewArrivalsListing allProducts={products} />;
}
