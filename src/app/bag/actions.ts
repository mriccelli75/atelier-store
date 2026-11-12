"use server";

import { and, eq, sql } from "drizzle-orm";
import { refresh } from "next/cache";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { MAX_LINE_QUANTITY } from "@/lib/bag-cookie";
import { getBagId, getOrCreateBagId, loadBag } from "@/lib/cart";

export type AddToBagState =
  | { status: "idle" }
  | { status: "added"; message: string }
  | { status: "error"; message: string };

export async function addToBag(
  _prev: AddToBagState,
  formData: FormData,
): Promise<AddToBagState> {
  const slug = String(formData.get("slug") ?? "");
  const sizeValue = formData.get("size");
  const size = typeof sizeValue === "string" && sizeValue ? sizeValue : null;

  const product = await db.query.products.findFirst({ where: eq(products.slug, slug) });
  if (!product) return { status: "error", message: "This piece is no longer available." };

  if (product.sizes) {
    if (!size) return { status: "error", message: "Select a size to add this to your bag." };
    if (!product.sizes.some((s) => s.label === size && s.available)) {
      return { status: "error", message: `Size ${size} is sold out.` };
    }
  } else if (size) {
    return { status: "error", message: "This piece doesn't come in sizes." };
  }

  if (product.stockQuantity <= 0) {
    return { status: "error", message: "This piece has just sold out." };
  }

  const bagId = await getOrCreateBagId();
  const bag = await loadBag(bagId);
  const inBag = bag.lines
    .filter((line) => line.slug === slug)
    .reduce((n, line) => n + line.quantity, 0);
  const line = bag.lines.find((l) => l.slug === slug && l.size === size);

  if (inBag + 1 > product.stockQuantity || (line && line.quantity >= MAX_LINE_QUANTITY)) {
    return {
      status: "error",
      message:
        product.stockQuantity === 1
          ? "The last piece is already in your bag."
          : `All ${Math.min(product.stockQuantity, MAX_LINE_QUANTITY)} available pieces are already in your bag.`,
    };
  }

  await db
    .insert(cartItems)
    .values({ cartId: bagId, productId: product.id, size, quantity: 1 })
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.productId, cartItems.size],
      set: { quantity: sql`${cartItems.quantity} + 1`, updatedAt: new Date() },
    });

  refresh();
  return {
    status: "added",
    message: `${product.name}${size ? `, size ${size},` : ""} is in your bag.`,
  };
}

export async function updateBagQuantity(lineId: number, quantity: number) {
  const bagId = await getBagId();
  if (!bagId || !Number.isInteger(quantity)) return;

  if (quantity <= 0) {
    await removeFromBag(lineId);
    return;
  }

  const bag = await loadBag(bagId);
  const line = bag.lines.find((l) => l.id === lineId);
  if (!line) return;

  await db
    .update(cartItems)
    .set({ quantity: Math.min(quantity, line.maxQuantity) })
    .where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, bagId)));
  refresh();
}

export async function removeFromBag(lineId: number) {
  const bagId = await getBagId();
  if (!bagId) return;
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, bagId)));
  refresh();
}
