// Server-side bag (cart) access. The bag is identified by the httpOnly `bag`
// cookie; signing in merges a guest bag into the user's bag (see auth.ts).
// Prices and stock always come from the database, never from the client.

import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { cartItems, carts, products } from "@/db/schema";
import { BAG_COOKIE, MAX_LINE_QUANTITY, bagCookieOptions, isBagId } from "./bag-cookie";
import { EMPTY_BAG, type Bag, type BagLine } from "./bag-types";

export async function getBagId(): Promise<string | null> {
  const value = (await cookies()).get(BAG_COOKIE)?.value;
  return isBagId(value) ? value : null;
}

/** Returns the current bag id, creating a bag (and cookie) if needed. Server actions only. */
export async function getOrCreateBagId(): Promise<string> {
  const existing = await getBagId();
  if (existing) {
    const [row] = await db.select({ id: carts.id }).from(carts).where(eq(carts.id, existing));
    if (row) return row.id;
  }
  const [created] = await db.insert(carts).values({}).returning({ id: carts.id });
  (await cookies()).set(BAG_COOKIE, created.id, bagCookieOptions);
  return created.id;
}

export async function getBag(): Promise<Bag> {
  const bagId = await getBagId();
  if (!bagId) return EMPTY_BAG;
  return loadBag(bagId);
}

export async function loadBag(bagId: string): Promise<Bag> {
  const rows = await db
    .select({ item: cartItems, product: products })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, bagId))
    .orderBy(asc(cartItems.createdAt), asc(cartItems.id));

  if (rows.length === 0) return { ...EMPTY_BAG, id: bagId };

  // Stock is per product, so lines of the same product in different sizes share it.
  const quantityByProduct = new Map<number, number>();
  for (const { item } of rows) {
    quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) ?? 0) + item.quantity);
  }

  const lines: BagLine[] = rows.map(({ item, product }) => {
    const stock = product.stockQuantity;
    const inBag = quantityByProduct.get(product.id) ?? 0;
    const sizeOption = product.sizes?.find((s) => s.label === item.size);
    const sizeOk = product.sizes ? !!sizeOption?.available : item.size === null;

    let issue: BagLine["issue"] = null;
    if (stock <= 0) issue = "sold_out";
    else if (!sizeOk) issue = "size_unavailable";
    else if (inBag > stock) issue = "insufficient_stock";

    return {
      id: item.id,
      slug: product.slug,
      name: product.name,
      material: product.material,
      image: product.images[0] ?? null,
      size: item.size,
      sizes: product.sizes,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      lineTotalCents: product.priceCents * item.quantity,
      stockQuantity: stock,
      maxQuantity: Math.max(
        item.quantity,
        Math.min(MAX_LINE_QUANTITY, stock - (inBag - item.quantity)),
      ),
      issue,
    };
  });

  return {
    id: bagId,
    lines,
    count: lines.reduce((n, line) => n + line.quantity, 0),
    subtotalCents: lines.reduce((n, line) => n + line.lineTotalCents, 0),
    canCheckout: lines.every((line) => line.issue === null),
  };
}

/**
 * Moves a guest bag's lines into the user's bag and returns the id the cookie
 * should point at. Quantities for the same piece and size are added together;
 * stock limits are enforced when the bag is read.
 */
export async function mergeBagIntoUser(
  guestBagId: string | null,
  userId: string,
): Promise<string | null> {
  const [userBag] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, userId));

  if (!guestBagId) return userBag?.id ?? null;

  const [guestBag] = await db
    .select({ id: carts.id, userId: carts.userId })
    .from(carts)
    .where(eq(carts.id, guestBagId));

  // Unknown cookie, or it already points at some user's bag (theirs or another's).
  if (!guestBag || guestBag.userId) return userBag?.id ?? null;

  if (!userBag) {
    await db.update(carts).set({ userId }).where(eq(carts.id, guestBag.id));
    return guestBag.id;
  }

  await db.batch([
    db.execute(sql`
      insert into ${cartItems} (cart_id, product_id, size, quantity)
      select ${userBag.id}, product_id, size, quantity
      from ${cartItems} where cart_id = ${guestBag.id}
      on conflict on constraint cart_items_line_unique
      do update set quantity = least(${cartItems.quantity} + excluded.quantity, ${MAX_LINE_QUANTITY}),
                    updated_at = now()
    `),
    db.delete(carts).where(eq(carts.id, guestBag.id)),
  ]);
  return userBag.id;
}
