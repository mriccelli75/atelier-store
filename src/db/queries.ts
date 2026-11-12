// Cached, server-only reads for the storefront. Pages and components get
// product data from here, never from `db` directly.
//
// Every function is tagged "products"; call `updateTag("products")` (or
// `revalidateTag`) after changing product or stock data to refresh pages
// before the hourly revalidation.

import "server-only";
import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { stockStatus, type Category, type Product } from "@/lib/products";
import { db } from "./index";
import {
  categories,
  products,
  type CategoryRow,
  type ProductRow,
} from "./schema";
import type { ShopDepartment } from "@/lib/departments";

type ProductWithCategory = ProductRow & { category: CategoryRow };

function toProduct(row: ProductWithCategory): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: { slug: row.category.slug, name: row.category.name },
    material: row.material,
    priceCents: row.priceCents,
    description: row.description,
    details: row.details,
    care: row.care,
    images: row.images,
    stock: { status: stockStatus(row.stockQuantity), quantity: row.stockQuantity },
    sizes: row.sizes ?? undefined,
    isNew: row.isNew,
  };
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);

  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { category: true },
  });
  return row ? toProduct(row) : undefined;
}

/** Products in the order given. Throws on an unknown slug. */
export async function getProducts(slugs: string[]): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  if (slugs.length === 0) return [];
  const rows = await db.query.products.findMany({
    where: inArray(products.slug, slugs),
    with: { category: true },
  });
  const bySlug = new Map(rows.map((row) => [row.slug, toProduct(row)]));
  return slugs.map((slug) => {
    const product = bySlug.get(slug);
    if (!product) throw new Error(`Unknown product: ${slug}`);
    return product;
  });
}

/** Same-category products first, topped up from other categories. */
export async function getRelatedProducts(
  slug: string,
  count = 4,
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const categoryId = db
    .select({ id: products.categoryId })
    .from(products)
    .where(eq(products.slug, slug));

  const rows = await db.query.products.findMany({
    where: ne(products.slug, slug),
    with: { category: true },
    orderBy: [
      sql`(${products.categoryId} = (${categoryId})) desc nulls last`,
      asc(products.id),
    ],
    limit: count,
  });
  return rows.map(toProduct);
}

/**
 * Products in the given categories, newest arrivals first. With a department,
 * only that department's products plus unisex ones.
 */
export async function getSectionProducts({
  categorySlugs,
  department,
  newOnly = false,
}: {
  categorySlugs: string[];
  department?: ShopDepartment;
  newOnly?: boolean;
}): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  if (categorySlugs.length === 0) return [];
  const categoryIds = db
    .select({ id: categories.id })
    .from(categories)
    .where(inArray(categories.slug, categorySlugs));

  const rows = await db.query.products.findMany({
    where: and(
      department ? inArray(products.department, [department, "unisex"]) : undefined,
      inArray(products.categoryId, categoryIds),
      newOnly ? eq(products.isNew, true) : undefined,
    ),
    with: { category: true },
    orderBy: [desc(products.isNew), asc(products.id)],
  });
  return rows.map(toProduct);
}

/**
 * Every product flagged new, across all departments, most recently added
 * first. Rows inserted together share a `created_at`, so ties fall back to
 * the newest id.
 */
export async function getNewArrivals(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    where: eq(products.isNew, true),
    with: { category: true },
    orderBy: [desc(products.createdAt), desc(products.id)],
  });
  return rows.map(toProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .orderBy(asc(products.id));
  return rows.map((row) => row.slug);
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.id));
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    image: row.imageSrc ? { src: row.imageSrc, alt: row.imageAlt ?? "" } : null,
  }));
}
