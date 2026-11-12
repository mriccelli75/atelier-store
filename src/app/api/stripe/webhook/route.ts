import { revalidateTag } from "next/cache";
import type Stripe from "stripe";
import { cancelCheckoutSession, fulfillCheckoutSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (error) {
    console.error("[stripe] Webhook signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      // Delayed methods (e.g. bank debits) complete unpaid and succeed later.
      if (await fulfillCheckoutSession(event.data.object)) {
        // Refresh cached stock labels right away.
        revalidateTag("products", { expire: 0 });
      }
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await cancelCheckoutSession(event.data.object.id);
      break;
  }

  return Response.json({ received: true });
}
