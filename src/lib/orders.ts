// Order creation and fulfilment. Server-only; the Stripe webhook is the source
// of truth for payment, the /checkout/complete page only displays.

import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import { cartItems, orderItems, orders, products } from "@/db/schema";
import type { Bag } from "./bag-types";
import { getStripe } from "./stripe";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function orderNumber() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `AT-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}

/** Inserts a pending order with a snapshot of the bag's lines. */
export async function createPendingOrder(bag: Bag & { id: string }, user: { id: string; email: string } | null) {
  const id = crypto.randomUUID();
  const number = orderNumber();
  const productIds = await db
    .select({ id: products.id, slug: products.slug })
    .from(products)
    .where(sql`${products.slug} in ${bag.lines.map((l) => l.slug)}`);
  const idBySlug = new Map(productIds.map((p) => [p.slug, p.id]));

  await db.batch([
    db.insert(orders).values({
      id,
      number,
      userId: user?.id ?? null,
      email: user?.email ?? null,
      cartId: bag.id,
      subtotalCents: bag.subtotalCents,
      totalCents: bag.subtotalCents,
    }),
    db.insert(orderItems).values(
      bag.lines.map((line) => ({
        orderId: id,
        productId: idBySlug.get(line.slug) ?? null,
        slug: line.slug,
        name: line.name,
        material: line.material,
        size: line.size,
        imageSrc: line.image?.src ?? null,
        imageAlt: line.image?.alt ?? null,
        unitPriceCents: line.unitPriceCents,
        quantity: line.quantity,
      })),
    ),
  ]);
  return { id, number };
}

/** Expires earlier unpaid checkout sessions for this bag, so only one can be paid. */
export async function cancelPendingOrdersForBag(bagId: string) {
  const pending = await db
    .select({ id: orders.id, sessionId: orders.stripeCheckoutSessionId })
    .from(orders)
    .where(and(eq(orders.cartId, bagId), eq(orders.status, "pending")));

  for (const order of pending) {
    if (order.sessionId) {
      try {
        await getStripe().checkout.sessions.expire(order.sessionId);
      } catch {
        // Already expired or completed; the webhook settles completed ones.
        continue;
      }
    }
    await db
      .update(orders)
      .set({ status: "cancelled" })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending")));
  }
}

export async function getOrderBySession(sessionId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.stripeCheckoutSessionId, sessionId),
    with: { items: true },
  });
}

/**
 * Marks the order paid, decrements stock and empties the bag. Idempotent and
 * safe under concurrent webhook deliveries: only the request that flips the
 * order from pending to paid does the rest. Returns true when stock changed.
 */
export async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<boolean> {
  if (session.payment_status === "unpaid") return false;

  const address = session.collected_information?.shipping_details;
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const [order] = await db
    .update(orders)
    .set({
      status: "paid",
      paidAt: new Date(),
      email: session.customer_details?.email ?? undefined,
      stripePaymentIntentId: paymentIntent,
      currency: session.currency ?? "usd",
      subtotalCents: session.amount_subtotal ?? undefined,
      shippingCents: session.total_details?.amount_shipping ?? 0,
      taxCents: session.total_details?.amount_tax ?? 0,
      totalCents: session.amount_total ?? undefined,
      shippingAddress: address
        ? {
            name: address.name ?? null,
            line1: address.address.line1 ?? null,
            line2: address.address.line2 ?? null,
            city: address.address.city ?? null,
            state: address.address.state ?? null,
            postalCode: address.address.postal_code ?? null,
            country: address.address.country ?? null,
          }
        : null,
    })
    .where(and(eq(orders.stripeCheckoutSessionId, session.id), eq(orders.status, "pending")))
    .returning({ id: orders.id, cartId: orders.cartId });

  if (!order) return false; // Unknown session, or already handled.

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const stocked = items.filter((item) => item.productId !== null);
  if (stocked.length === 0) return false;

  // Guarded decrements: a row only changes if enough stock remains.
  const [first, ...rest] = stocked.map((item) =>
    db
      .update(products)
      .set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` })
      .where(and(eq(products.id, item.productId!), gte(products.stockQuantity, item.quantity)))
      .returning({ id: products.id }),
  );
  const results = await db.batch([first, ...rest]);
  const oversold = results.some((rows) => rows.length === 0);

  await db.batch([
    db.update(orders).set({ needsReview: oversold }).where(eq(orders.id, order.id)),
    db.delete(cartItems).where(eq(cartItems.cartId, order.cartId ?? sql`null`)),
  ]);

  if (oversold) {
    console.error(`[orders] Order ${order.id} paid but stock ran out; flagged for review.`);
  }
  return true;
}

export async function cancelCheckoutSession(sessionId: string) {
  await db
    .update(orders)
    .set({ status: "cancelled" })
    .where(and(eq(orders.stripeCheckoutSessionId, sessionId), eq(orders.status, "pending")));
}
