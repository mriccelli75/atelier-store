"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getBag } from "@/lib/cart";
import { cancelPendingOrdersForBag, createPendingOrder } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export type CheckoutSessionResult = { clientSecret: string } | { error: string };

const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ["US", "CA", "GB", "FR", "DE", "IT", "ES", "NL", "AU", "JP"];

export async function createCheckoutSession(): Promise<CheckoutSessionResult> {
  const bag = await getBag();
  if (!bag.id || bag.lines.length === 0) return { error: "Your bag is empty." };
  if (!bag.canCheckout) return { error: "Some items in your bag need attention." };

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const user = session ? { id: session.user.id, email: session.user.email } : null;

  const origin =
    process.env.BETTER_AUTH_URL ?? requestHeaders.get("origin") ?? "http://localhost:3000";

  await cancelPendingOrdersForBag(bag.id);
  const order = await createPendingOrder({ ...bag, id: bag.id }, user);

  try {
    const checkout = await getStripe().checkout.sessions.create(
      {
        ui_mode: "embedded_page",
        mode: "payment",
        currency: "usd",
        client_reference_id: order.id,
        metadata: { orderId: order.id, orderNumber: order.number },
        customer_email: user?.email,
        line_items: bag.lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: "usd",
            unit_amount: line.unitPriceCents,
            product_data: {
              name: line.size ? `${line.name}, size ${line.size}` : line.name,
              description: line.material,
              images: line.image ? [line.image.src] : undefined,
              metadata: { slug: line.slug },
            },
          },
        })),
        shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
        shipping_options: [
          {
            shipping_rate_data: {
              display_name: "Complimentary standard delivery",
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "usd" },
              delivery_estimate: {
                minimum: { unit: "business_day", value: 2 },
                maximum: { unit: "business_day", value: 4 },
              },
            },
          },
          {
            shipping_rate_data: {
              display_name: "Express delivery",
              type: "fixed_amount",
              fixed_amount: { amount: 2500, currency: "usd" },
              delivery_estimate: {
                minimum: { unit: "business_day", value: 1 },
                maximum: { unit: "business_day", value: 2 },
              },
            },
          },
        ],
        // Requires Stripe Tax to be set up in the Dashboard.
        automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
        return_url: `${origin}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
        // Accounts with Managed Payments on by default reject our own tax and
        // shipping settings; opt out per request. Not yet in the SDK's types.
        ...({ managed_payments: { enabled: false } } as object),
      },
      { idempotencyKey: `checkout-${order.id}` },
    );

    await db
      .update(orders)
      .set({ stripeCheckoutSessionId: checkout.id })
      .where(eq(orders.id, order.id));

    if (!checkout.client_secret) throw new Error("Stripe returned no client secret");
    return { clientSecret: checkout.client_secret };
  } catch (error) {
    console.error("[checkout] Could not create Stripe session", error);
    await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, order.id));
    return { error: "We couldn't start checkout. Please try again." };
  }
}
