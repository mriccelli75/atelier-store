"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useCallback, useState } from "react";
import { createCheckoutSession } from "./actions";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

export function CheckoutForm() {
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    const result = await createCheckoutSession();
    if ("error" in result) {
      setError(result.error);
      throw new Error(result.error);
    }
    return result.clientSecret;
  }, []);

  if (error) {
    return (
      <div role="alert" className="py-section-sm text-center">
        <p className="text-body text-sale">{error}</p>
        <Link href="/bag" className="btn btn-secondary mt-6">
          Return to bag
        </Link>
      </div>
    );
  }

  return (
    <div id="checkout" className="min-h-[32rem]">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
