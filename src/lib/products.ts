// Product types and pure helpers, safe to import from client components.
// Data comes from the database through `@/db/queries`.

import type { ProductImage, ProductSize } from "@/db/schema";

export type { ProductImage, ProductSize };

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type Category = {
  slug: string;
  name: string;
  image: ProductImage | null;
};

export type Product = {
  slug: string;
  name: string;
  category: Pick<Category, "slug" | "name">;
  material: string;
  priceCents: number; // USD
  description: string;
  details: string[];
  care: string;
  /** First image is the listing image; the rest are gallery views. */
  images: ProductImage[];
  stock: { status: StockStatus; quantity: number };
  /** Present for sized items. `available: false` means that size is sold out. */
  sizes?: ProductSize[];
  isNew: boolean;
};

/** At or below this many pieces, the product shows "Only N left". */
export const LOW_STOCK_THRESHOLD = 3;

export function stockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export { categoryHref } from "./departments";
export const productHref = (product: Pick<Product, "slug">) =>
  `/products/${product.slug}`;

/** Customer-facing stock message. */
export function stockLabel(product: Pick<Product, "stock">) {
  switch (product.stock.status) {
    case "in_stock":
      return "In stock";
    case "low_stock":
      return `Only ${product.stock.quantity} left`;
    case "out_of_stock":
      return "Sold out";
  }
}

/** Whole dollars, or dollars and cents when there are cents (e.g. tax). */
export function formatPrice(cents: number) {
  const digits = cents % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(cents / 100);
}
