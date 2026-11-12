// Loads ./seed-data.ts into the database. Safe to re-run: rows are upserted by slug.
// Run with `npm run db:seed`.

import { getTableColumns, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "./index";
import { categories, products } from "./schema";
import { seedCategories, seedProducts } from "./seed-data";

/** `SET col = excluded.col` for every column except the ones listed. */
function excludedSet<T extends PgTable>(table: T, skip: string[]) {
  const set: Record<string, SQL> = {};
  for (const [key, column] of Object.entries(getTableColumns(table))) {
    if (skip.includes(key)) continue;
    set[key] = sql.raw(`excluded."${column.name}"`);
  }
  return set;
}

async function main() {
  const savedCategories = await db
    .insert(categories)
    .values(seedCategories)
    .onConflictDoUpdate({
      target: categories.slug,
      set: { ...excludedSet(categories, ["id", "slug", "createdAt"]), updatedAt: new Date() },
    })
    .returning({ id: categories.id, slug: categories.slug });

  const categoryId = new Map(savedCategories.map((c) => [c.slug, c.id]));

  const rows = seedProducts.map(({ categorySlug, ...product }) => {
    const id = categoryId.get(categorySlug);
    if (!id) throw new Error(`Unknown category "${categorySlug}" for ${product.slug}`);
    return { ...product, categoryId: id, sizes: product.sizes ?? null };
  });

  const savedProducts = await db
    .insert(products)
    .values(rows)
    .onConflictDoUpdate({
      target: products.slug,
      set: { ...excludedSet(products, ["id", "slug", "createdAt"]), updatedAt: new Date() },
    })
    .returning({ id: products.id });

  console.log(
    `Seeded ${savedCategories.length} categories and ${savedProducts.length} products.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
