import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

/**
 * Server-side Stripe client (API version pinned by the installed SDK).
 * Created on first use so builds don't need STRIPE_SECRET_KEY.
 */
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key, { appInfo: { name: "Atelier" } });
  }
  return client;
}
